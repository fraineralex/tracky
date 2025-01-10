'use cache'

import 'server-only'
import { db } from '~/server/db'
import { consumption, food } from '~/server/db/schema'
import { eq, and, gte } from 'drizzle-orm'
import {
	calculateAdjustedDay,
	calculateNutritionalNeeds
} from '~/lib/calculations'
import { NutritionMetricsPerDay } from '~/types'
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag
} from 'next/cache'

export async function getUserNutritionMetrics(
	userId: string,
	userMetadata: UserPublicMetadata
) {
	cacheLife('max')
	cacheTag('nutrition')

	const nutritionMeatrics = calculateNutritionalNeeds(userMetadata)
	const dayOfWeek = new Date()
	const todayIdx = calculateAdjustedDay(dayOfWeek)
	dayOfWeek.setDate(dayOfWeek.getDate() - calculateAdjustedDay(dayOfWeek) - 1)
	const result = await db
		.select({
			portion: consumption.portion,
			createdAt: consumption.createdAt,
			servingSize: food.servingSize,
			kcal: food.kcal,
			protein: food.protein,
			carbs: food.carbs,
			fat: food.fat
		})
		.from(consumption)
		.innerJoin(food, eq(consumption.foodId, food.id))
		.where(
			and(eq(consumption.userId, userId), gte(consumption.createdAt, dayOfWeek))
		)

	const nutritionMeatricsPerDay: NutritionMetricsPerDay = {}
	Array.from({ length: 7 }).forEach((_, index) => {
		nutritionMeatricsPerDay[index] = structuredClone(nutritionMeatrics)
	})

	result.forEach(
		({ portion, createdAt, servingSize, kcal, protein, carbs, fat }) => {
			const calories = (Number(portion) / Number(servingSize)) * Number(kcal)
			const proteinConsumed =
				(Number(portion) / Number(servingSize)) * Number(protein)
			const carbsConsumed =
				(Number(portion) / Number(servingSize)) * Number(carbs)
			const fatsConsumed = (Number(portion) / Number(servingSize)) * Number(fat)

			const day = calculateAdjustedDay(createdAt)
			if (day > todayIdx) return
			const nutrition =
				nutritionMeatricsPerDay[day] ?? structuredClone(nutritionMeatrics)

			nutrition.calories.consumed += calories
			nutrition.protein.consumed += proteinConsumed
			nutrition.carbs.consumed += carbsConsumed
			nutrition.fats.consumed += fatsConsumed
		}
	)

	return nutritionMeatricsPerDay
}

export async function getTodayNutritionMetrics(
	userId: string,
	userMetadata: UserPublicMetadata
) {
	cacheLife('max')
	cacheTag('nutrition')

	const todaynutritionMetrics = calculateNutritionalNeeds(userMetadata)
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	try {
		const result = await db
			.select({
				portion: consumption.portion,
				servingSize: food.servingSize,
				kcal: food.kcal,
				protein: food.protein,
				carbs: food.carbs,
				fat: food.fat
			})
			.from(consumption)
			.innerJoin(food, eq(consumption.foodId, food.id))
			.where(
				and(eq(consumption.userId, userId), gte(consumption.createdAt, today))
			)

		result.forEach(({ portion, servingSize, kcal, protein, carbs, fat }) => {
			const calories = (Number(portion) / Number(servingSize)) * Number(kcal)
			const proteinConsumed =
				(Number(portion) / Number(servingSize)) * Number(protein)
			const carbsConsumed =
				(Number(portion) / Number(servingSize)) * Number(carbs)
			const fatsConsumed = (Number(portion) / Number(servingSize)) * Number(fat)

			todaynutritionMetrics.calories.consumed += calories
			todaynutritionMetrics.protein.consumed += proteinConsumed
			todaynutritionMetrics.fats.consumed += fatsConsumed
			todaynutritionMetrics.carbs.consumed += carbsConsumed
		})

		return todaynutritionMetrics
	} catch (error) {
		console.error(error)
		return todaynutritionMetrics
	}
}
