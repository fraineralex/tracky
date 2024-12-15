'use server'

import 'server-only'
import { auth } from '@clerk/nextjs/server'
import { createInsertSchema } from 'drizzle-zod'
import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'
import { db } from '~/server/db'
import { consumption, diaryGroupEnum, food, unitEnum } from '~/server/db/schema'
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { desc, sql } from 'drizzle-orm'
import { NewConsumption } from '../dashboard/_actions'
import { SuccessLogData } from '~/types'

type NewFood = typeof food.$inferInsert

const FoodSchema = createInsertSchema(food, {
	name: z.string({ required_error: 'Please enter a name for the food' }),
	kcal: z.coerce
		.number({ required_error: 'Please enter the number of calories' })
		.nonnegative({ message: 'Number of calories must be a positive number' })
		.transform(value => value.toString()),
	protein: z.coerce
		.number({ required_error: 'Please enter the number of protein' })
		.nonnegative({ message: 'The number of protein must be a positive number' })
		.transform(value => value.toString()),
	carbs: z.coerce
		.number({ required_error: 'Please enter the number of carbs' })
		.nonnegative({ message: 'The number of carbs must be a positive number' })
		.transform(value => value.toString()),
	fat: z.coerce
		.number({ required_error: 'Please enter the number of Fats' })
		.nonnegative({ message: 'The number of fats must be a positive number' })
		.transform(value => value.toString()),
	servingSize: z.coerce
		.number({ required_error: 'Please enter the serving size' })
		.nonnegative({ message: 'The serving size must be a positive number' })
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
	const { userId } = await auth()

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
		revalidateTag('food')
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
	successLogData?: SuccessLogData[]
}

const ConsumptionSchema = z.object({
	consumption: z.array(
		z.object({
			foodName: z.string().describe('Name of the food').nullable(),
			portion: z.number().describe('Portion size in grams').nullable(),
			mealGroup: z
				.enum(diaryGroupEnum.enumValues)
				.describe('Meal group')
				.default('uncategorized')
		})
	)
})

export async function logMealAI(messages: Message[]): Promise<Message[]> {
	const { userId } = await auth()

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
				'Generate an array of food consumption entries. Ensure data accuracy and adherence to the schema. Set food name to null if missing. Convert portions to grams. Adjust meal group based on time of day (morning: breakfast, afternoon: lunch, evening: dinner).',
			messages,
			schema: ConsumptionSchema
		})
		object = result.object
		console.log(object)
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

	const successLogData: SuccessLogData[] = []
	try {
		await db.transaction(async trx => {
			for (const item of response.data.consumption) {
				const result = await trx
					.select({
						id: food.id,
						name: food.name,
						protein: food.protein,
						kcal: food.kcal,
						fat: food.fat,
						carbs: food.carbs,
						servingSize: food.servingSize
					})
					.from(food)
					.where(sql`lower(${food.name}) = lower(${item.foodName})`)
					.orderBy(desc(food.createdAt))
					.limit(1)
					.execute()

				if (!result || result.length === 0 || !result[0]) {
					return [
						...messages,
						{
							role: 'assistant',
							content: `Sorry, the food with name ${item.foodName} not found, please register it first or try another food.`
						}
					]
				}

				const foodObj = result[0]

				const newConsumption = {
					userId,
					foodId: foodObj.id,
					portion: item.portion?.toString(),
					unit: 'g',
					mealGroup: item.mealGroup
				} as NewConsumption

				await trx.insert(consumption).values(newConsumption)
				successLogData.push({
					successMessage: 'Food consumption logged successfully',
					title: foodObj.name,
					subTitle: (
						(Number(foodObj.kcal) / Number(foodObj.servingSize)) *
						item.portion!
					).toFixed(),
					subTitleUnit: 'Calories',
					items: [
						{
							name: 'Protein',
							amount: `${(
								(Number(foodObj.protein) / Number(foodObj.servingSize)) *
								item.portion!
							).toFixed()} g`
						},
						{
							name: 'Carbs',
							amount: `${(
								(Number(foodObj.carbs) / Number(foodObj.servingSize)) *
								item.portion!
							).toFixed()} g`
						},
						{
							name: 'Fats',
							amount: `${(
								(Number(foodObj.fat) / Number(foodObj.servingSize)) *
								item.portion!
							).toFixed()} g`
						}
					]
				})
			}
		})
	} catch (error) {
		console.error('Error inserting consumption:', error)
		return errorResponse
	}

	revalidatePath('/food')
	return [
		...messages,
		{
			role: 'assistant',
			content: 'Food consumption logged successfully',
			successLogData
		}
	]
}
