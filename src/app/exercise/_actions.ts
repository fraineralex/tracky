'use server'

import 'server-only'
import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'
import { db } from '~/server/db'
import {
	diaryGroupEnum,
	effortEnum,
	exercise,
	exerciseCategory
} from '~/server/db/schema'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { desc, ilike } from 'drizzle-orm'
import { Message } from '../food/_actions'
import { EXERCISE_ICONS } from '~/constants'
import { NewExercise } from '../dashboard/_actions'
import { calculateEnergyBurned } from '~/lib/calculations'
import { SuccessLogData, TrakedField } from '~/types'
import { getMealCategoryFromTime } from '~/lib/utils'
import { Buffer } from 'node:buffer'
import { DescribeImageInput } from '../food/_actions'
import { type CoreMessage, type ImagePart, type TextPart } from 'ai'

const ExerciseSchema = z.object({
	exercise: z.array(
		z.object({
			duration: z.number().describe('Duration in minutes'),
			effort: z
				.enum(effortEnum.enumValues)
				.describe('Effort level')
				.default('moderate'),
			diaryGroup: z
				.enum(diaryGroupEnum.enumValues)
				.describe('Diary group')
				.default('uncategorized'),
			category: z
				.enum(Object.keys(EXERCISE_ICONS) as [string, ...string[]])
				.describe('Category')
				.nullable()
		})
	)
})

export async function logExerciseAI(messages: Message[]): Promise<Message[]> {
	const user = await currentUser()

	if (!user) {
		return [
			...messages,
			{
				role: 'assistant',
				content: 'You must be logged in to generate exercise data.'
			}
		]
	}

	const { weights, height, born, sex } = user?.publicMetadata

	const currentWeight = weights[weights.length - 1] as TrakedField[number]
	const age = new Date().getFullYear() - new Date(born as string).getFullYear()
	const currentHeight = height[height.length - 1] as TrakedField[number]

	let object
	try {
		const result = await generateObject({
			model: google('gemini-2.5-flash-lite', {
				structuredOutputs: false
			}),
			system: `You are a fitness app assistant generating exercise data to log in the database. Analyze exercise images (Apple Watch screenshots, treadmill displays, fitness equipment screens, etc.) and extract exercise information including: exercise type/category, duration in minutes, effort level, and any visible metrics. For images, estimate values based on what you see (e.g., if you see "30 min" on a treadmill, use 30 minutes; if you see calories burned, use that to estimate effort level). Ensure the data follows the provided schema. Adjust unclear categories to the most applicable or set to null if not possible. Estimate duration in minutes if not provided. Adjust diary group based on time of day (e.g., morning to breakfast, afternoon to lunch, evening to dinner).`,
			messages: toCoreMessages(messages),
			schema: ExerciseSchema
		})
		object = result.object
	} catch (error) {
		console.error('Error generating object:', error)
		return [
			...messages,
			{
				role: 'assistant',
				content: 'Oops! There was an error generating the exercise data.'
			}
		]
	}

	const response = ExerciseSchema.safeParse(object)
	const errorResponse = [
		...messages,
		{
			role: 'assistant',
			content: 'Oops! There was an error with your submission.'
		}
	] satisfies Message[]

	if (!response.success) {
		console.error('Schema validation failed:', response.error)
		return errorResponse
	}

	const latestUserMessage = [...messages]
		.reverse()
		.find(message => message.role === 'user')
	const clientTime = latestUserMessage?.clientTime
		? new Date(latestUserMessage.clientTime)
		: new Date()

	const missingInfoMessages: string[] = []
	response.data.exercise.forEach(item => {
		if (!item.category) {
			missingInfoMessages.push('Please provide the name of the exercise.')
		}
		if (!item.duration || item.duration <= 0) {
			missingInfoMessages.push('Please provide a valid duration in minutes.')
		}
	})

	if (missingInfoMessages.length > 0) {
		return [
			...messages,
			{ role: 'assistant', content: missingInfoMessages.join(' ') }
		]
	}

	const successLogData: SuccessLogData[] = []
	try {
		await db.transaction(async trx => {
			for (const item of response.data.exercise) {
				const result = await trx
					.select({
						id: exerciseCategory.id,
						multiplier: exerciseCategory.energyBurnedPerMinute
					})
					.from(exerciseCategory)
					.where(ilike(exerciseCategory.name, `%${item.category}%`))
					.orderBy(desc(exerciseCategory.createdAt))
					.limit(1)
					.execute()

				if (result.length === 0) {
					return [
						...messages,
						{
							role: 'assistant',
							content: `Sorry, the exercise with name ${item.category} not found, please register it first or try another exercise name.`
						}
					]
				}

				const categoryId = result[0]?.id
				const categoryMultiplier = Number(result[0]?.multiplier ?? 0)

				const energyBurned = calculateEnergyBurned({
					duration: item.duration,
					effort: item.effort,
					currentWeight: currentWeight.value,
					height: currentHeight.value,
					age,
					sex,
					categoryMultiplier
				})

				const diaryGroup =
					item.diaryGroup === 'uncategorized'
						? getMealCategoryFromTime(clientTime)
						: item.diaryGroup

				const newExercise = {
					energyBurned,
					categoryId,
					duration: item.duration?.toString(),
					effort: item.effort,
					diaryGroup,
					userId: user.id
				} as NewExercise

				await trx.insert(exercise).values(newExercise)
				successLogData.push({
					successMessage: 'Exercise logged successfully',
					title: item.category!,
					subTitle: diaryGroup,
					items: [
						{ name: 'Energy Burned', amount: energyBurned, unit: 'kcal' },
						{
							name: 'Duration',
							amount: item.duration.toString(),
							unit: 'minutes'
						},
						{ name: 'Effort', amount: item.effort }
					]
				})
			}
		})
	} catch (error) {
		console.error('Error inserting exercise:', error)
		return errorResponse
	}

	revalidateTag('resume-streak')
	revalidatePath('/exercise')
	revalidatePath('/dashboard')
	revalidatePath('/diary')
	return [
		...messages,
		{
			role: 'assistant',
			content: 'Exercise logged successfully',
			successLogData
		}
	]
}

const imageUrlPattern = /^data:(?<mime>[^;]+);base64,(?<data>.+)$/

const decodeBase64Image = (dataUrl: string) => {
	const match = imageUrlPattern.exec(dataUrl)
	if (!match?.groups?.data) return null
	try {
		return Buffer.from(match.groups.data, 'base64')
	} catch (error) {
		console.error('Unable to decode base64 image', error)
		return null
	}
}

const IMAGE_TIMEOUT_MS = 15000

const withTimeout = async <T>(
	promise: Promise<T>,
	timeoutMs: number,
	label: string
) => {
	let timeoutId: NodeJS.Timeout | undefined
	const timeoutPromise = new Promise<never>((_, reject) => {
		timeoutId = setTimeout(
			() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)),
			timeoutMs
		)
	})

	try {
		return await Promise.race([promise, timeoutPromise])
	} finally {
		if (timeoutId) clearTimeout(timeoutId)
	}
}

const toCoreMessages = (messages: Message[]): CoreMessage[] =>
	messages.map(message => {
		if (message.role === 'assistant') {
			return { role: 'assistant', content: message.content }
		}
		if (message.image) {
			const content: Array<TextPart | ImagePart> = []
			if (message.content) {
				content.push({ type: 'text', text: message.content })
			}
			const buffer = decodeBase64Image(message.image.dataUrl)
			if (buffer) {
				content.push({
					type: 'image',
					image: buffer,
					mimeType: message.image.mimeType
				})
			}
			return {
				role: 'user',
				content: content.length > 0 ? content : message.content
			}
		}
		return { role: 'user', content: message.content }
	})

const exerciseImageSummarySchema = z.object({
	summary: z
		.string()
		.max(100)
		.describe(
			'Short sentence describing the exercise in the image, including duration, type, and any visible metrics'
		)
})

export async function describeExerciseImage({
	dataUrl,
	mimeType
}: DescribeImageInput): Promise<string> {
	const user = await currentUser()
	if (!user) return 'Exercise image'

	const buffer = decodeBase64Image(dataUrl)
	if (!buffer) return 'Exercise image'

	try {
		const result = await withTimeout(
			generateObject({
				model: google('gemini-2.5-flash-lite', {
					structuredOutputs: false
				}),
				system:
					'Analyze exercise images (Apple Watch screenshots, treadmill displays, fitness equipment screens, etc.) and describe the exercise type, duration, distance, calories burned, or other visible metrics. Provide a concise description (max 15 words) that includes exercise name, duration in minutes, and any visible metrics.',
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'text',
								text: 'Describe the exercise shown in this image, including exercise type, duration, and any visible metrics like calories, distance, or heart rate.'
							},
							{
								type: 'image',
								image: buffer,
								mimeType
							}
						]
					}
				],
				schema: exerciseImageSummarySchema
			}),
			IMAGE_TIMEOUT_MS,
			'describeExerciseImage generateObject'
		)
		return result.object.summary.trim() || 'Exercise image'
	} catch (error) {
		console.error('Error describing exercise image:', error)
		return 'Exercise image'
	}
}
