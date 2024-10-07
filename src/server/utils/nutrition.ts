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
		.select()
		.from(consumption)
		.innerJoin(food, eq(consumption.foodId, food.id))
		.where(
			and(eq(consumption.userId, userId), gte(consumption.createdAt, dayOfWeek))
		)

	const nutritionMeatricsPerDay: NutritionMetricsPerDay = {}
	Array.from({ length: 7 }).forEach((_, index) => {
		nutritionMeatricsPerDay[index] = structuredClone(nutritionMeatrics)
	})

	result.forEach(({ consumption, food }) => {
		const calories =
			(Number(consumption.portion) / Number(food.servingSize)) *
			Number(food.kcal)
		const protein =
			(Number(consumption.portion) / Number(food.servingSize)) *
			Number(food.protein)
		const carbs =
			(Number(consumption.portion) / Number(food.servingSize)) *
			Number(food.carbs)
		const fats =
			(Number(consumption.portion) / Number(food.servingSize)) *
			Number(food.fat)

		const day = getAdjustedDay(consumption.createdAt)
		let nutrition = nutritionMeatricsPerDay[day] ?? structuredClone(nutritionMeatrics)

		nutrition.calories.consumed += calories
		nutrition.protein.consumed += protein
		nutrition.carbs.consumed += carbs
		nutrition.fats.consumed += fats
	})

	return nutritionMeatricsPerDay
}
