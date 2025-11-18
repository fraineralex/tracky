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
import { getMealCategoryFromTime } from '~/lib/utils'

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
	clientTime?: string
}

const macroInstruction =
	'For every entry include a macrosPer100g object with numeric calories, protein, carbs, and fats for a 100 gram serving. Estimate values whenever possible and only set a field to null if there is absolutely no visual or textual information.'
const portionInstruction =
	'Always provide a positive numeric portion in grams for every entry. When the user omits measurements, infer realistic gram amounts using food knowledge (for example a medium apple is about 180g, a banana about 120g, a cup of liquid about 240g). Never leave the portion null or zero.'

const textOnlySystemPrompt = `Generate an array of food consumption entries. Ensure data accuracy and adherence to the schema. Set food name to null if missing. Convert portions to grams. Adjust meal group based on time of day (morning: breakfast, afternoon: lunch, evening: dinner). ${macroInstruction} ${portionInstruction}`

const imageSystemPrompt = `Analyze each attached meal or nutrition label image. Identify every distinct food item or packaged product, extract macros and serving details from any tables, and estimate realistic gram portions using visual context and common serving probabilities. Return entries that follow the schema, convert all portions to grams, note uncertainties, and follow these requirements: ${macroInstruction} ${portionInstruction}`

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

const defaultPortionInGrams = 150

const quantityWordPatterns = [
	{ match: /\bhalf\b/i, value: 0.5 },
	{ match: /\bquarter\b/i, value: 0.25 },
	{ match: /\btwo\b/i, value: 2 },
	{ match: /\bthree\b/i, value: 3 },
	{ match: /\bfour\b/i, value: 4 },
	{ match: /\bfive\b/i, value: 5 }
]

const portionLookupTable = [
	{ match: /\bapple\b/i, grams: 182 },
	{ match: /\bbanana\b/i, grams: 118 },
	{ match: /\borange\b/i, grams: 140 },
	{ match: /\bpear\b/i, grams: 178 },
	{ match: /\bpeach\b/i, grams: 150 },
	{ match: /\bplum\b/i, grams: 66 },
	{ match: /\bgrape\b/i, grams: 5 },
	{ match: /\bberry\b/i, grams: 12 },
	{ match: /\bblueberry\b/i, grams: 1 },
	{ match: /\bstrawberry\b/i, grams: 12 },
	{ match: /\bmango\b/i, grams: 200 },
	{ match: /\bavocado\b/i, grams: 136 },
	{ match: /\bkiwi\b/i, grams: 76 },
	{ match: /\bmelon\b/i, grams: 180 },
	{ match: /\bwatermelon\b/i, grams: 280 },
	{ match: /\bcarrot\b/i, grams: 61 },
	{ match: /\bpotato\b/i, grams: 173 },
	{ match: /\bsweet potato\b/i, grams: 200 },
	{ match: /\bbroccoli\b/i, grams: 90 },
	{ match: /\bcauliflower\b/i, grams: 100 },
	{ match: /\bspinach\b/i, grams: 30 },
	{ match: /\bsalad\b/i, grams: 85 },
	{ match: /\bsoup\b/i, grams: 240 },
	{ match: /\brice\b/i, grams: 150 },
	{ match: /\bpasta\b/i, grams: 140 },
	{ match: /\boatmeal\b/i, grams: 40 },
	{ match: /\bbread\b/i, grams: 30 },
	{ match: /\btortilla\b/i, grams: 50 },
	{ match: /\bchicken breast\b/i, grams: 120 },
	{ match: /\bchicken thigh\b/i, grams: 100 },
	{ match: /\bchicken wing\b/i, grams: 30 },
	{ match: /\bchicken\b/i, grams: 120 },
	{ match: /\bbeef\b/i, grams: 150 },
	{ match: /\bpork\b/i, grams: 140 },
	{ match: /\bsalmon\b/i, grams: 170 },
	{ match: /\btuna\b/i, grams: 165 },
	{ match: /\begg white\b/i, grams: 33 },
	{ match: /\begg yolk\b/i, grams: 17 },
	{ match: /\begg\b/i, grams: 50 },
	{ match: /\byogurt\b/i, grams: 170 },
	{ match: /\bprotein shake\b/i, grams: 350 },
	{ match: /\bcoffee\b/i, grams: 240 },
	{ match: /\btea\b/i, grams: 240 },
	{ match: /\bjuice\b/i, grams: 240 },
	{ match: /\bsmoothie\b/i, grams: 355 },
	{ match: /\bwater\b/i, grams: 240 },
	{ match: /\bwine\b/i, grams: 147 }
]

const detectQuantityMultiplier = (text: string) => {
	const numeric = text.match(/(\d+(\.\d+)?)/)
	if (numeric?.[1]) {
		const value = parseFloat(numeric[1])
		if (!Number.isNaN(value) && value > 0) return value
	}
	for (const word of quantityWordPatterns) {
		if (word.match.test(text)) return word.value
	}
	return 1
}

const estimatePortionInGrams = (name?: string | null) => {
	if (!name) return defaultPortionInGrams
	const normalized = name.toLowerCase()
	const multiplier = detectQuantityMultiplier(normalized)
	for (const entry of portionLookupTable) {
		if (entry.match.test(normalized)) {
			return entry.grams * multiplier
		}
	}
	if (/\bcup\b/.test(normalized)) return 240 * multiplier
	if (/\bglass\b/.test(normalized)) return 240 * multiplier
	if (/\bcan\b/.test(normalized)) return 355 * multiplier
	if (/\btablespoon\b|\btbsp\b/.test(normalized)) return 15 * multiplier
	if (/\bteaspoon\b|\btsp\b/.test(normalized)) return 5 * multiplier
	if (/\bshot\b/.test(normalized)) return 44 * multiplier
	return defaultPortionInGrams * multiplier
}

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

	const clientTime = latestUserMessage?.clientTime
		? new Date(latestUserMessage.clientTime)
		: new Date()

	const consumptionEntries = response.data.consumption.map(item => {
		const resolvedPortion =
			item.portion && item.portion > 0
				? item.portion
				: estimatePortionInGrams(item.foodName)
		const mealGroup =
			item.mealGroup === 'uncategorized'
				? getMealCategoryFromTime(clientTime)
				: item.mealGroup
		return {
			...item,
			portion: resolvedPortion,
			mealGroup
		}
	})

	const missingInfoMessages: string[] = []
	consumptionEntries.forEach(item => {
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
			for (const item of consumptionEntries) {
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
