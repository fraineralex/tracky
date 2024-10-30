import 'server-only'

import { calculateNutritionalNeeds, getAdjustedDay } from '~/lib/utils'
import { NutritionMetricsPerDay, PublicMetadata } from '~/types'
import { db } from '~/server/db'
import { consumption, food } from '~/server/db/schema'
import { eq, and, gte } from 'drizzle-orm'

export async function getUserNutritionMetrics(
	userId: string,
	userMetadata: PublicMetadata
) {
	const nutritionMeatrics = calculateNutritionalNeeds(userMetadata)
	const dayOfWeek = new Date()
	dayOfWeek.setDate(dayOfWeek.getDate() - getAdjustedDay(dayOfWeek) - 1)
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

	result.forEach(({ portion, createdAt, servingSize, kcal, protein, carbs, fat }) => {
		const calories = (Number(portion) / Number(servingSize)) * Number(kcal)
		const proteinConsumed = (Number(portion) / Number(servingSize)) * Number(protein)
		const carbsConsumed = (Number(portion) / Number(servingSize)) * Number(carbs)
		const fatsConsumed = (Number(portion) / Number(servingSize)) * Number(fat)

		const day = getAdjustedDay(createdAt)
		const nutrition = nutritionMeatricsPerDay[day] ?? structuredClone(nutritionMeatrics)

		nutrition.calories.consumed += calories
		nutrition.protein.consumed += proteinConsumed
		nutrition.carbs.consumed += carbsConsumed
		nutrition.fats.consumed += fatsConsumed
	})

	return nutritionMeatricsPerDay
}
