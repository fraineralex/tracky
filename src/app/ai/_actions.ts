'use server'

import 'server-only'
import { auth, currentUser } from '@clerk/nextjs/server'
import {
	generateObject,
	type CoreMessage,
	type ImagePart,
	type TextPart
} from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { Buffer } from 'node:buffer'
import { db } from '~/server/db'
import {
	consumption,
	diaryGroupEnum,
	effortEnum,
	exercise,
	exerciseCategory,
	food
} from '~/server/db/schema'
import { getMealCategoryFromTime } from '~/lib/utils'
import { calculateEnergyBurned } from '~/lib/calculations'
import { desc, ilike } from 'drizzle-orm'
import { revalidatePath, revalidateTag } from 'next/cache'
import { SuccessLogData, TrakedField } from '~/types'
import { EXERCISE_ICONS } from '~/constants'
import type { DescribeImageInput, Message } from './types'

type NewFood = typeof food.$inferInsert
type NewConsumption = typeof consumption.$inferInsert
type NewExercise = typeof exercise.$inferInsert

const macroInstruction =
	'For every food entry include macrosPer100g with numeric calories, protein, carbs, and fats for a 100 gram serving. Estimate values whenever possible and only set a field to null if information is completely missing.'
const portionInstruction =
	'Always provide a positive numeric portion in grams for every consumption entry. When the user omits measurements, infer realistic gram amounts using common serving sizes (a medium apple ≈ 180g, banana ≈ 120g, cup ≈ 240g). Never leave portion null or zero.'

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

const exerciseImageSummarySchema = z.object({
	summary: z
		.string()
		.max(90)
		.describe('Short phrase describing either a meal or an exercise image')
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

const exerciseCategoryNames = Object.keys(EXERCISE_ICONS) as [
	string,
	...string[]
]

const FoodEntrySchema = z.object({
	intent: z.literal('food'),
	name: z.string().min(1),
	macrosPer100g: macrosPerHundredSchema
})

const ConsumptionEntrySchema = z.object({
	intent: z.literal('consumption'),
	foodName: z.string().nullable(),
	portion: z.number().nullable(),
	mealGroup: z.enum(diaryGroupEnum.enumValues).default('uncategorized'),
	macrosPer100g: macrosPerHundredSchema.nullable().optional()
})

const ExerciseEntrySchema = z.object({
	intent: z.literal('exercise'),
	duration: z.number().positive().nullable(),
	effort: z.enum(effortEnum.enumValues).default('moderate'),
	diaryGroup: z.enum(diaryGroupEnum.enumValues).default('uncategorized'),
	category: z.enum(exerciseCategoryNames).nullable()
})

const MultiIntentSchema = z.object({
	entries: z.array(
		z.discriminatedUnion('intent', [
			FoodEntrySchema,
			ConsumptionEntrySchema,
			ExerciseEntrySchema
		])
	)
})

type GenerationFailureReason = 'timeout' | 'unrecognized' | 'unknown'

const classifyGenerationError = (error: unknown): GenerationFailureReason => {
	if (error instanceof Error) {
		const name = error.name?.toLowerCase() ?? ''
		const message = error.message?.toLowerCase() ?? ''
		if (message.includes('timed out')) return 'timeout'
		if (
			name.includes('json') ||
			name.includes('parse') ||
			name.includes('noobject') ||
			message.includes('no object generated') ||
			message.includes('json parsing failed')
		) {
			return 'unrecognized'
		}
	}
	return 'unknown'
}

const retryNoticeForReason = (reason: GenerationFailureReason) => {
	if (reason === 'timeout') {
		return 'The AI request took too long. Retrying with a smarter model...'
	}
	return 'I could not interpret those entries yet. Retrying with a smarter model...'
}

const failureMessageForReason = (reason: GenerationFailureReason) => {
	if (reason === 'timeout') {
		return 'Logging failed because the AI request timed out. Please try again later.'
	}
	return 'I could not identify the meals or exercises from that input. Please try clearer details or another image.'
}

const baseSystemPrompt = `You are Tracky's health logging assistant. Analyze the conversation and produce an array named entries. Each entry must include an intent field with one of these values:
- "food": register a new food in the catalog with name and macrosPer100g.
- "consumption": log what the user ate using existing foods. Convert every portion to grams. ${macroInstruction} ${portionInstruction}
- "exercise": log a workout with duration in minutes, effort level, diary group, and category (cardio, strength, yoga, etc.).
Use the schema exactly and infer realistic values when not specified. If the user describes both meals and workouts, include multiple entries. Prefer detailed but concise outputs.`

const imageSystemPrompt = `Analyze every attached meal photo, nutrition label, or workout screenshot along with the conversation. Identify foods, serving details, or exercise metrics. Follow the same schema rules:
- "food": register catalog items with macrosPer100g derived from labels or estimates.
- "consumption": log what was eaten, inferring realistic gram portions. ${macroInstruction} ${portionInstruction}
- "exercise": log workouts, estimating duration and effort from displays or text.
Convert all units to grams or minutes where applicable and prefer precise data over generic text.`

const selectFoodFields = {
	id: food.id,
	name: food.name,
	protein: food.protein,
	kcal: food.kcal,
	fat: food.fat,
	carbs: food.carbs,
	servingSize: food.servingSize
}

type SelectedFoodRow = {
	id: string
	name: string
	protein: string
	kcal: string
	fat: string
	carbs: string
	servingSize: string
}

const findFoodByName = async (
	name: string
): Promise<SelectedFoodRow | undefined> => {
	const result = await db
		.select(selectFoodFields)
		.from(food)
		.where(ilike(food.name, `%${name}%`))
		.orderBy(desc(food.createdAt))
		.limit(1)
	return result[0] as SelectedFoodRow | undefined
}

const createFoodIfPossible = async (
	name: string,
	macros: MacrosPerHundred | null | undefined,
	userId: string
): Promise<SelectedFoodRow | null> => {
	if (!hasCompleteMacros(macros)) return null
	const [inserted] = await db
		.insert(food)
		.values(buildFoodFromMacros(name, macros, userId))
		.returning(selectFoodFields)
	return inserted as SelectedFoodRow
}

const getLatestTrackedField = (
	field?: TrakedField | null
): TrakedField[number] | null => {
	if (!field || field.length === 0) return null
	return field[field.length - 1] ?? null
}

const normalizeDiaryGroup = (
	group: (typeof diaryGroupEnum.enumValues)[number],
	clientTime: Date
) => (group === 'uncategorized' ? getMealCategoryFromTime(clientTime) : group)

const toTitleCase = (value: string) =>
	value
		.split(/\s+/)
		.filter(Boolean)
		.map(part => part[0]?.toUpperCase() + part.slice(1).toLowerCase())
		.join(' ')

const buildSuccessLogFromFood = (
	foodRow: SelectedFoodRow,
	portion: number
): SuccessLogData => {
	const servingSize = Number(foodRow.servingSize) || 100
	const portionFactor = portion / servingSize
	return {
		successMessage: 'Food consumption logged successfully',
		title: toTitleCase(foodRow.name),
		subTitle: (Number(foodRow.kcal) * portionFactor).toFixed(),
		subTitleUnit: 'Calories',
		items: [
			{
				name: 'Protein',
				amount: `${(Number(foodRow.protein) * portionFactor).toFixed()} g`
			},
			{
				name: 'Carbs',
				amount: `${(Number(foodRow.carbs) * portionFactor).toFixed()} g`
			},
			{
				name: 'Fats',
				amount: `${(Number(foodRow.fat) * portionFactor).toFixed()} g`
			}
		]
	}
}

export async function logHealthAI(messages: Message[]): Promise<Message[]> {
	const { userId } = await auth()
	if (!userId) {
		return [
			...messages,
			{
				role: 'assistant',
				content:
					'You must be logged in to log meals or exercises. Please sign in and try again.'
			}
		]
	}

	const user = await currentUser()
	if (!user) {
		return [
			...messages,
			{
				role: 'assistant',
				content:
					'Unable to load your profile. Please refresh and try logging again.'
			}
		]
	}

	const latestUserMessage = [...messages]
		.reverse()
		.find(message => message.role === 'user')
	const hasImageInput = Boolean(latestUserMessage?.image)
	const sourceMessages =
		latestUserMessage !== undefined ? [latestUserMessage] : messages
	const formattedMessages = toCoreMessages(sourceMessages)
	const responseMessages: Message[] = [...messages]
	const retryModels = ['gemini-2.5-flash-lite', 'gemini-2.5-flash'] as const
	let failureReason: GenerationFailureReason = 'unknown'
	let object: z.infer<typeof MultiIntentSchema> | null = null

	for (const [index, modelId] of retryModels.entries()) {
		try {
			const result = await withTimeout(
				generateObject({
					model: google(modelId, {
						structuredOutputs: false
					}),
					system: hasImageInput ? imageSystemPrompt : baseSystemPrompt,
					messages: formattedMessages,
					schema: MultiIntentSchema
				}),
				AI_TIMEOUT_MS,
				'logHealthAI generateObject'
			)
			object = result.object
			break
		} catch (error) {
			console.error('Error generating multi-intent object:', error)
			failureReason = classifyGenerationError(error)
			if (index === retryModels.length - 1) {
				responseMessages.push({
					role: 'assistant',
					content: failureMessageForReason(failureReason)
				})
				return responseMessages
			}
			responseMessages.push({
				role: 'assistant',
				content: retryNoticeForReason(failureReason)
			})
		}
	}

	if (!object) {
		responseMessages.push({
			role: 'assistant',
			content:
				'Oops! There was an error generating the health entries. Please try again later.'
		})
		return responseMessages
	}

	const parsed = MultiIntentSchema.safeParse(object)
	if (!parsed.success) {
		console.error('Multi-intent schema failed:', parsed.error)
		responseMessages.push({
			role: 'assistant',
			content: 'Oops! There was an error with your submission.'
		})
		return responseMessages
	}

	const clientTime = latestUserMessage?.clientTime
		? new Date(latestUserMessage.clientTime)
		: new Date()
	const profileMetadata = user.publicMetadata as Record<string, unknown>
	const weightsHistory = profileMetadata.weights as TrakedField | undefined
	const heightHistory = profileMetadata.height as TrakedField | undefined
	const born = profileMetadata.born as string | undefined
	const sex = (profileMetadata.sex as string | undefined) ?? null

	const latestWeight = getLatestTrackedField(weightsHistory)
	const latestHeight = getLatestTrackedField(heightHistory)
	const age =
		born && !Number.isNaN(Date.parse(born))
			? new Date().getFullYear() - new Date(born).getFullYear()
			: null

	const successLogData: SuccessLogData[] = []
	const newCatalogFoods: string[] = []
	const errorMessages: string[] = []
	let shouldRevalidateFood = false
	let shouldRevalidateConsumption = false
	let shouldRevalidateExercise = false

	for (const entry of parsed.data.entries) {
		if (entry.intent === 'food') {
			if (!hasCompleteMacros(entry.macrosPer100g)) {
				errorMessages.push(
					`Unable to register ${entry.name} because nutritional data was incomplete.`
				)
				continue
			}

			try {
				const existing = await findFoodByName(entry.name)
				if (!existing) {
					await db
						.insert(food)
						.values(
							buildFoodFromMacros(entry.name, entry.macrosPer100g, userId)
						)
					if (!newCatalogFoods.includes(entry.name)) {
						newCatalogFoods.push(entry.name)
					}
					shouldRevalidateFood = true
				}
			} catch (error) {
				console.error('Error inserting AI food:', error)
				errorMessages.push(
					`Unable to register ${entry.name}. Please try again.`
				)
			}
			continue
		}

		if (entry.intent === 'consumption') {
			const foodName = entry.foodName?.trim()
			if (!foodName) {
				errorMessages.push('Please provide the name of the food.')
				continue
			}

			const portion =
				entry.portion && entry.portion > 0
					? entry.portion
					: estimatePortionInGrams(foodName)
			const mealGroup = normalizeDiaryGroup(entry.mealGroup, clientTime)

			try {
				let resolvedFood: SelectedFoodRow | null =
					(await findFoodByName(foodName)) ?? null
				if (!resolvedFood) {
					resolvedFood = await createFoodIfPossible(
						foodName,
						entry.macrosPer100g,
						userId
					)
					if (resolvedFood) {
						if (!newCatalogFoods.includes(foodName)) {
							newCatalogFoods.push(foodName)
						}
						shouldRevalidateFood = true
					}
				}

				if (!resolvedFood) {
					errorMessages.push(
						`Unable to register ${foodName} because it does not exist yet and no nutrition label was provided.`
					)
					continue
				}

				const newConsumption = {
					userId,
					foodId: resolvedFood.id,
					portion: portion.toString(),
					unit: 'g',
					mealGroup
				} as NewConsumption

				await db.insert(consumption).values(newConsumption)
				shouldRevalidateConsumption = true
				successLogData.push(buildSuccessLogFromFood(resolvedFood, portion))
			} catch (error) {
				console.error('Error logging AI consumption:', error)
				errorMessages.push(
					`Unable to register ${foodName}. Please try again later.`
				)
			}
			continue
		}

		if (entry.intent === 'exercise') {
			const duration = entry.duration ?? null
			const categoryName = entry.category ?? undefined
			if (!duration || duration <= 0) {
				errorMessages.push(
					'Please provide a valid exercise duration in minutes.'
				)
				continue
			}
			if (!categoryName) {
				errorMessages.push('Please provide the name of the exercise.')
				continue
			}
			if (!latestWeight || !latestHeight || age === null || !sex) {
				errorMessages.push(
					`Cannot log ${categoryName} because your profile is missing height, weight, age, or sex data.`
				)
				continue
			}

			try {
				const categoryResult = await db
					.select({
						id: exerciseCategory.id,
						multiplier: exerciseCategory.energyBurnedPerMinute
					})
					.from(exerciseCategory)
					.where(ilike(exerciseCategory.name, `%${categoryName}%`))
					.orderBy(desc(exerciseCategory.createdAt))
					.limit(1)
					.execute()

				if (categoryResult.length === 0) {
					errorMessages.push(
						`Unable to log ${categoryName} because it is not in your catalog yet. Please register it first or try another name.`
					)
					continue
				}

				const categoryId = categoryResult[0]?.id
				const categoryMultiplier = Number(categoryResult[0]?.multiplier ?? 0)
				const diaryGroup = normalizeDiaryGroup(entry.diaryGroup, clientTime)

				const energyBurned = calculateEnergyBurned({
					duration,
					effort: entry.effort,
					currentWeight: latestWeight.value,
					height: latestHeight.value,
					age,
					sex,
					categoryMultiplier
				})

				const newExercise = {
					energyBurned,
					categoryId,
					duration: duration.toString(),
					effort: entry.effort,
					diaryGroup,
					userId
				} as NewExercise

				await db.insert(exercise).values(newExercise)
				shouldRevalidateExercise = true
				successLogData.push({
					successMessage: 'Exercise logged successfully',
					title: categoryName,
					subTitle: diaryGroup,
					items: [
						{ name: 'Energy Burned', amount: energyBurned, unit: 'kcal' },
						{ name: 'Duration', amount: duration.toString(), unit: 'minutes' },
						{ name: 'Effort', amount: entry.effort }
					]
				})
			} catch (error) {
				console.error('Error logging AI exercise:', error)
				errorMessages.push(
					`Unable to log ${categoryName}. Please try again later.`
				)
			}
		}
	}

	if (shouldRevalidateFood) {
		revalidateTag('food')
		revalidatePath('/food')
		revalidatePath('/diary')
	}

	if (shouldRevalidateConsumption) {
		revalidateTag('resume-streak')
		revalidateTag('nutrition')
		revalidateTag('food')
		revalidatePath('/food')
		revalidatePath('/dashboard')
		revalidatePath('/diary')
	}

	if (shouldRevalidateExercise) {
		revalidateTag('resume-streak')
		revalidatePath('/exercise')
		revalidatePath('/dashboard')
		revalidatePath('/diary')
	}

	const baseLength = responseMessages.length

	if (newCatalogFoods.length > 0) {
		const catalogMessage = `New foods added: ${newCatalogFoods
			.map(toTitleCase)
			.join(', ')}`
		responseMessages.push({
			role: 'assistant',
			content: catalogMessage
		})
	}

	if (errorMessages.length > 0) {
		responseMessages.push({
			role: 'assistant',
			content: errorMessages.join(' ')
		})
	}

	if (successLogData.length > 0) {
		responseMessages.push({
			role: 'assistant',
			content: 'Entries logged successfully.',
			successLogData
		})
	}

	if (responseMessages.length === baseLength) {
		responseMessages.push({
			role: 'assistant',
			content:
				'No entries were logged. Please provide clearer meal or workout details so I can register them.'
		})
	}

	return responseMessages
}

export async function describeEntryImage({
	dataUrl,
	mimeType
}: DescribeImageInput): Promise<string> {
	const buffer = decodeBase64Image(dataUrl)
	if (!buffer) return 'Entry image'

	try {
		const result = await withTimeout(
			generateObject({
				model: google('gemini-2.5-flash-lite', {
					structuredOutputs: false
				}),
				system:
					'Describe whether this image shows a meal or an exercise screen. Mention key foods for meals or workout type plus metrics for exercises in under eight words.',
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'text',
								text: 'Describe this image for a fitness tracker entry.'
							},
							{
								type: 'image',
								image: buffer,
								mimeType
							}
						] as Array<TextPart | ImagePart>
					}
				],
				schema: exerciseImageSummarySchema
			}),
			IMAGE_TIMEOUT_MS,
			'describeEntryImage generateObject'
		)
		return result.object.summary.trim() || 'Entry image'
	} catch (error) {
		console.error('Error describing entry image:', error)
		return 'Entry image'
	}
}
