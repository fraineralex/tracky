'use server'

import 'server-only'
import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '~/server/db'
import {
	diaryGroupEnum,
	effortEnum,
	exercise,
	exerciseCategory
} from '~/server/db/schema'
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { desc, sql } from 'drizzle-orm'
import { Message } from '../food/_actions'
import { EXERCISE_ICONS } from '~/constants'
import { NewExercise } from '../dashboard/_actions'
import { calculateEnergyBurned } from '~/lib/calculations'
import { SuccessLogData, TrakedField } from '~/types'

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
			model: openai('gpt-4-turbo'),
			system: `You are a fitness app assistant generating exercise data to log in the database. Ensure the data follows the provided schema. Adjust unclear categories to the most applicable or set to null if not possible. Estimate duration in minutes if not provided. Adjust diary group based on time of day (e.g., morning to breakfast, afternoon to lunch, evening to dinner).`,
			messages,
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
					.where(sql`lower(${exerciseCategory.name}) = lower(${item.category})`)
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

				const newExercise = {
					energyBurned,
					categoryId,
					duration: item.duration?.toString(),
					effort: item.effort,
					diaryGroup: item.diaryGroup,
					userId: user.id
				} as NewExercise

				await trx.insert(exercise).values(newExercise)
				successLogData.push({
					successMessage: 'Exercise logged successfully',
					title: item.category!,
					subTitle: item.diaryGroup,
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

	revalidatePath('/exercise')
	return [
		...messages,
		{
			role: 'assistant',
			content: 'Exercise logged successfully',
			successLogData
		}
	]
}
