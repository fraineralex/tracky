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
import { calculateEnergyBurned } from '~/lib/utils'
import { PublicMetadata, Weights } from '~/types'

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

	const { weights, weightUnit, height, heightUnit, born, sex } =
		user?.publicMetadata as PublicMetadata

	const currentWeight = weights[weights.length - 1] as Weights[number]
	const age = new Date().getFullYear() - new Date(born as string).getFullYear()

	let object
	try {
		const result = await generateObject({
			model: openai('gpt-4-turbo'),
			system:
				'You are an assistant in a fitness app that generates an array of exercise schemas to log user exercises in the database. Ensure the data is accurate and follows the provided schema. If the user does not provide a clear category, try to adjust it to the most applicable category option or set it to null if it is not possible. If the user does not provide a measurable duration, estimate the duration in minutes based on the average time typically spent on the exercise category provided.',

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
					weightUnit,
					height,
					heightUnit,
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

				console.log('NewExercise:', newExercise)
				await trx.insert(exercise).values(newExercise)
			}
		})
	} catch (error) {
		console.error('Error inserting exercise:', error)
		return errorResponse
	}

	revalidatePath('/exercise')
	return [
		...messages,
		{ role: 'assistant', content: 'Exercise logged successfully' }
	]
}
