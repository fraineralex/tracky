'use server'

import 'server-only'
import { auth } from '@clerk/nextjs/server'
import { createInsertSchema } from 'drizzle-zod'
import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'
import { db } from '~/server/db'
import { consumption, diaryGroupEnum, food, unitEnum } from '~/server/db/schema'
import {
	generateObject,
	type CoreMessage,
	type ImagePart,
	type TextPart
} from 'ai'
import { google } from '@ai-sdk/google'
import { desc, ilike } from 'drizzle-orm'
import { NewConsumption } from '../dashboard/_actions'
import { SuccessLogData } from '~/types'
import { Buffer } from 'node:buffer'

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
		if (newFood.unit === 'ml') newFood.unit = 'g'

		if (newFood.unit === 'g' && Number(newFood.servingSize) !== 100) {
			const multiplier = 100 / Number(newFood.servingSize)
			newFood.kcal = (Number(newFood.kcal) * multiplier).toFixed(2)
			newFood.protein = (Number(newFood.protein) * multiplier).toFixed(2)
			newFood.carbs = (Number(newFood.carbs) * multiplier).toFixed(2)
			newFood.fat = (Number(newFood.fat) * multiplier).toFixed(2)
		}

		if (newFood.unit === 'oz') {
			newFood.unit = 'g'
			const multiplier = (100 / Number(newFood.servingSize)) * 28.3495
			newFood.kcal = (Number(newFood.kcal) * multiplier).toFixed(2)
			newFood.protein = (Number(newFood.protein) * multiplier).toFixed(2)
			newFood.carbs = (Number(newFood.carbs) * multiplier).toFixed(2)
			newFood.fat = (Number(newFood.fat) * multiplier).toFixed(2)
		}

		if (newFood.unit === 'cup') {
			newFood.unit = 'g'
			const multiplier = (100 / Number(newFood.servingSize)) * 128
			newFood.kcal = (Number(newFood.kcal) * multiplier).toFixed(2)
			newFood.protein = (Number(newFood.protein) * multiplier).toFixed(2)
			newFood.carbs = (Number(newFood.carbs) * multiplier).toFixed(2)
			newFood.fat = (Number(newFood.fat) * multiplier).toFixed(2)
		}

		await db.insert(food).values(newFood)
		revalidateTag('food')
		revalidatePath('/food')
		revalidatePath('/diary')
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
	image?: {
		dataUrl: string
		mimeType: string
	}
	successLogData?: SuccessLogData[]
}

const macroInstruction =
	'For every entry include a macrosPer100g object with numeric calories, protein, carbs, and fats for a 100 gram serving. Estimate values whenever possible and only set a field to null if there is absolutely no visual or textual information.'

const textOnlySystemPrompt = `Generate an array of food consumption entries. Ensure data accuracy and adherence to the schema. Set food name to null if missing. Convert portions to grams. Adjust meal group based on time of day (morning: breakfast, afternoon: lunch, evening: dinner). ${macroInstruction}`

const imageSystemPrompt = `Analyze each attached meal or nutrition label image. Identify every distinct food item or packaged product, extract macros and serving details from any tables, and estimate realistic gram portions using visual context and common serving probabilities. Return entries that follow the schema, convert all portions to grams, note uncertainties, and follow this requirement: ${macroInstruction}`

const AI_TIMEOUT_MS = 25000
const IMAGE_TIMEOUT_MS = 15000

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

const macrosPerHundredSchema = z.object({
	kcalPer100g: z.number().nullable(),
	proteinPer100g: z.number().nullable(),
	carbsPer100g: z.number().nullable(),
	fatPer100g: z.number().nullable()
})

type MacrosPerHundred = z.infer<typeof macrosPerHundredSchema>

type CompleteMacros = {
	kcalPer100g: number
	proteinPer100g: number
	carbsPer100g: number
	fatPer100g: number
}

const ConsumptionSchema = z.object({
	consumption: z.array(
		z.object({
			foodName: z.string().describe('Name of the food').nullable(),
			portion: z.number().describe('Portion size in grams').nullable(),
			mealGroup: z
				.enum(diaryGroupEnum.enumValues)
				.describe('Meal group')
				.default('uncategorized'),
			macrosPer100g: macrosPerHundredSchema
				.describe('Macros for a 100 gram serving')
				.nullable()
				.optional()
		})
	)
})

const selectFoodFields = {
	id: food.id,
	name: food.name,
	protein: food.protein,
	kcal: food.kcal,
	fat: food.fat,
	carbs: food.carbs,
	servingSize: food.servingSize
}

const hasCompleteMacros = (
	macros?: MacrosPerHundred | null
): macros is CompleteMacros =>
	Boolean(
		macros &&
			macros.kcalPer100g !== null &&
			macros.proteinPer100g !== null &&
			macros.carbsPer100g !== null &&
			macros.fatPer100g !== null
	)

const formatMacroValue = (value: number) => Math.max(0, value).toFixed(2)

const buildFoodFromMacros = (
	name: string,
	macros: CompleteMacros,
	userId: string
) =>
	({
		userId,
		name,
		kcal: formatMacroValue(macros.kcalPer100g),
		protein: formatMacroValue(macros.proteinPer100g),
		carbs: formatMacroValue(macros.carbsPer100g),
		fat: formatMacroValue(macros.fatPer100g),
		servingSize: '100',
		unit: 'g'
	}) satisfies NewFood

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

	let object: typeof ConsumptionSchema._type
	const latestUserMessage = [...messages]
		.reverse()
		.find(message => message.role === 'user')
	const hasImageInput = Boolean(latestUserMessage?.image)
	const formattedMessages = toCoreMessages(messages)
	const systemPrompt = hasImageInput ? imageSystemPrompt : textOnlySystemPrompt
	try {
		const result = await withTimeout(
			generateObject({
				model: google('gemini-2.5-flash-lite', {
					structuredOutputs: false
				}),
				system: systemPrompt,
				messages: formattedMessages,
				schema: ConsumptionSchema
			}),
			AI_TIMEOUT_MS,
			'logMealAI generateObject'
		)
		object = result.object
		console.log('Food consumption data generated:', object)
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
	const errorMessages: string[] = []
	try {
		await db.transaction(async trx => {
			for (const item of response.data.consumption) {
				const portion = item.portion ?? 0
				const foodName = item.foodName?.trim()
				if (!foodName || portion <= 0) {
					errorMessages.push(
						'Unable to register a meal because required details were missing.'
					)
					continue
				}

				try {
					const macros = item.macrosPer100g ?? null
					const existing = await trx
						.select(selectFoodFields)
						.from(food)
						.where(ilike(food.name, `%${foodName}%`))
						.orderBy(desc(food.createdAt))
						.limit(1)
						.execute()

					let resolvedFood = existing[0]

					if (!resolvedFood && hasCompleteMacros(macros)) {
						const [inserted] = await trx
							.insert(food)
							.values(buildFoodFromMacros(foodName, macros, userId))
							.returning(selectFoodFields)
						resolvedFood = inserted
					}

					if (!resolvedFood) {
						errorMessages.push(
							`Unable to register ${foodName} because it was not found and lacked nutritional data.`
						)
						continue
					}

					const newConsumption = {
						userId,
						foodId: resolvedFood.id,
						portion: portion.toString(),
						unit: 'g',
						mealGroup: item.mealGroup
					} as NewConsumption

					await trx.insert(consumption).values(newConsumption)

					const servingSize = Number(resolvedFood.servingSize) || 100
					const portionFactor = portion / servingSize

					successLogData.push({
						successMessage: 'Food consumption logged successfully',
						title: resolvedFood.name,
						subTitle: (Number(resolvedFood.kcal) * portionFactor).toFixed(),
						subTitleUnit: 'Calories',
						items: [
							{
								name: 'Protein',
								amount: `${(Number(resolvedFood.protein) * portionFactor).toFixed()} g`
							},
							{
								name: 'Carbs',
								amount: `${(Number(resolvedFood.carbs) * portionFactor).toFixed()} g`
							},
							{
								name: 'Fats',
								amount: `${(Number(resolvedFood.fat) * portionFactor).toFixed()} g`
							}
						]
					})
				} catch (error) {
					console.error('Error logging consumption item:', error)
					errorMessages.push(
						`Unable to register ${foodName}. Please try again.`
					)
				}
			}
		})
	} catch (error) {
		console.error('Error inserting consumption:', error)
		return errorResponse
	}

	if (successLogData.length > 0) {
		revalidateTag('resume-streak')
		revalidateTag('nutrition')
		revalidateTag('food')
		revalidatePath('/food')
		revalidatePath('/dashboard')
		revalidatePath('/diary')
	}

	const responseMessages: Message[] = [...messages]

	if (errorMessages.length > 0) {
		responseMessages.push({
			role: 'assistant',
			content: errorMessages.join(' ')
		})
	}

	if (successLogData.length > 0) {
		responseMessages.push({
			role: 'assistant',
			content: 'Food consumption logged successfully',
			successLogData
		})
	}

	if (responseMessages.length === messages.length) {
		return [
			...messages,
			{
				role: 'assistant',
				content:
					'No meals were logged. Please provide more details or clearer nutritional info so we can register them.'
			}
		]
	}

	return responseMessages
}

const imageSummarySchema = z.object({
	summary: z
		.string()
		.max(80)
		.describe('Short sentence describing the foods in the image')
})

export type DescribeImageInput = {
	dataUrl: string
	mimeType: string
}

export async function describeMealImage({
	dataUrl,
	mimeType
}: DescribeImageInput): Promise<string> {
	const { userId } = await auth()
	if (!userId) return 'Meal image'

	const buffer = decodeBase64Image(dataUrl)
	if (!buffer) return 'Meal image'

	try {
		const result = await withTimeout(
			generateObject({
				model: google('gemini-2.5-flash-lite', {
					structuredOutputs: false
				}),
				system:
					'Describe the main foods visible in the photo using a concise phrase (max 6 words). Mention only the key ingredients.',
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'text',
								text: 'Describe the foods in this meal photo using a short phrase.'
							},
							{
								type: 'image',
								image: buffer,
								mimeType
							}
						]
					}
				],
				schema: imageSummarySchema
			}),
			IMAGE_TIMEOUT_MS,
			'describeMealImage generateObject'
		)
		return result.object.summary.trim() || 'Meal image'
	} catch (error) {
		console.error('Error describing meal image:', error)
		return 'Meal image'
	}
}
