'use server'

import 'server-only'
import { auth } from '@clerk/nextjs/server'
import { createInsertSchema } from 'drizzle-zod'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '~/server/db'
import { consumption, diaryGroupEnum, food, unitEnum } from '~/server/db/schema'
import { generateObject, streamObject, streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { desc, sql } from 'drizzle-orm'
import { NewConsumption } from '../dashboard/_actions'

type NewFood = typeof food.$inferInsert

const FoodSchema = createInsertSchema(food, {
	name: z.string({ required_error: 'Please enter a name for the food' }),
	kcal: z.coerce
		.number({ required_error: 'Please enter the number of calories' })
		.positive({ message: 'Number of calories must be a positive number' })
		.transform(value => value.toString()),
	protein: z.coerce
		.number({ required_error: 'Please enter the number of protein' })
		.positive({ message: 'The number of protein must be a positive number' })
		.transform(value => value.toString()),
	carbs: z.coerce
		.number({ required_error: 'Please enter the number of carbs' })
		.positive({ message: 'The number of carbs must be a positive number' })
		.transform(value => value.toString()),
	fat: z.coerce
		.number({ required_error: 'Please enter the number of Fats' })
		.positive({ message: 'The number of fats must be a positive number' })
		.transform(value => value.toString()),
	servingSize: z.coerce
		.number({ required_error: 'Please enter the serving size' })
		.positive({ message: 'The serving size must be a positive number' })
		.transform(value => value.toString()),
	unit: z.enum(unitEnum.enumValues, {
		required_error: 'Please select a unit of measure'
	})
})

export type FoodState = {
	errors?: {
		name?: string[]
		kcal?: string[]
		protein?: string[]
		carbs?: string[]
		fat?: string[]
		servingSize?: string[]
		unit?: string[]
	}
	message?: string
	success?: boolean
}

export const registerFood = async (
	prevState: FoodState | undefined,
	formData: FormData
) => {
	const { userId } = auth()

	if (!userId) {
		return {
			messages: history,
			newMessage: 'You must be logged in to generate food consumption data.'
		}
	}

	if (!userId)
		return {
			message: 'You must be logged in to register a food',
			success: false
		}

	const validatedFields = FoodSchema.safeParse({
		userId,
		...Object.fromEntries(formData.entries())
	})

	if (!validatedFields.success)
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Oops! There was an error with your submission.'
		}

	try {
		const newFood = validatedFields.data satisfies NewFood
		await db.insert(food).values(newFood)
		revalidatePath('/food')
		return { message: 'Food registered successfully', success: true }
	} catch (error) {
		console.error(error)

		return {
			message: 'Food registration failed. Please try again later',
			success: false
		}
	}
}

export interface Message {
	role: 'user' | 'assistant'
	content: string
}

const ConsumptionSchema = z.object({
	consumption: z.array(
		z.object({
			foodName: z.string().describe('Name of the food').nullable(),
			portion: z.number().describe('Portion size in grams').nullable(),
			mealGroup: z.enum(diaryGroupEnum.enumValues).describe('Meal group')
		})
	)
})

export async function logFoodConsumption(
	messages: Message[]
): Promise<Message[]> {
	const { userId } = auth()

	if (!userId) {
		return [
			...messages,
			{
				role: 'assistant',
				content: 'You must be logged in to generate food consumption data.'
			}
		]
	}

	let object
	try {
		const result = await generateObject({
			model: openai('gpt-4-turbo'),
			system:
				'You are an assistant in a fitness app that generates an array of food consumption schemas to log the user food consumptions in the database. Ensure the data is accurate and follows the provided schema. If the user does not provide a food name, set it to null. If the user does not provide a measurable portion, estimate the portion in grams based on the quantity and type of food provided. Convert the portion to grams if it is not in grams. If the meal group is not specified, set it to "uncategorized".',

			messages,
			schema: ConsumptionSchema
		})
		object = result.object
	} catch (error) {
		console.error('Error generating object:', error)
		return [
			...messages,
			{
				role: 'assistant',
				content:
					'Oops! There was an error generating the food consumption data.'
			}
		]
	}

	const response = ConsumptionSchema.safeParse(object)
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
	response.data.consumption.forEach(item => {
		if (!item.foodName) {
			missingInfoMessages.push('Please provide the name of the food.')
		}
		if (!item.portion || item.portion <= 0) {
			missingInfoMessages.push('Please provide a valid portion size in grams.')
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
			for (const item of response.data.consumption) {
				const result = await trx
					.select({ id: food.id })
					.from(food)
					.where(sql`lower(${food.name}) = lower(${item.foodName})`)
					.orderBy(desc(food.createdAt))
					.limit(1)
					.execute()

				if (result.length === 0) {
					return [
						...messages,
						{
							role: 'assistant',
							content: `Sorry, the food with name ${item.foodName} not found, please register it first or try another food.`
						}
					]
				}

				const foodId = result[0]?.id

				const newConsumption = {
					userId,
					foodId,
					portion: item.portion?.toString(),
					unit: 'g',
					mealGroup: item.mealGroup
				} as NewConsumption

				await trx.insert(consumption).values(newConsumption)
			}
		})
	} catch (error) {
		console.error('Error inserting consumption:', error)
		return errorResponse
	}

	revalidatePath('/food')
	return [
		...messages,
		{ role: 'assistant', content: 'Food consumption logged successfully' }
	]
}
