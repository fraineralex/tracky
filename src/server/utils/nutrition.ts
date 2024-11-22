import 'server-only'

import { calculateNutritionalNeeds, getAdjustedDay } from '~/lib/utils'
import { NutritionMetricsPerDay } from '~/types'
import { db } from '~/server/db'
import { consumption, food } from '~/server/db/schema'
import { eq, and, gte } from 'drizzle-orm'

export async function getUserNutritionMetrics(
	userId: string,
	userMetadata: UserPublicMetadata
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

	result.forEach(
		({ portion, createdAt, servingSize, kcal, protein, carbs, fat }) => {
			const calories = (Number(portion) / Number(servingSize)) * Number(kcal)
			const proteinConsumed =
				(Number(portion) / Number(servingSize)) * Number(protein)
			const carbsConsumed =
				(Number(portion) / Number(servingSize)) * Number(carbs)
			const fatsConsumed = (Number(portion) / Number(servingSize)) * Number(fat)

			const day = getAdjustedDay(createdAt)
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

export function calculateBodyFat({
	sex,
	born,
	height,
	weights
}: UserPublicMetadata) {
	const weightInKg = weights[weights.length - 1]?.value ?? 0
	const heightInMeters = height * 0.3048
	const bmi = weightInKg / (heightInMeters * heightInMeters)

	const age = new Date().getFullYear() - parseInt(born, 10)

	let bodyFatPercentage = 1.2 * bmi + 0.23 * age - 16.2

	if (sex === 'female') {
		bodyFatPercentage = 1.2 * bmi + 0.23 * age - 5.4
	}

	return bodyFatPercentage
}

export function calculateGoalProgress({
	weights,
	goalWeight
}: UserPublicMetadata) {
	const initialWeight = weights[0]?.value ?? 0
	const currentWeight = weights[weights.length - 1]?.value ?? 0

	if (initialWeight > goalWeight) {
		const progress =
			((initialWeight - currentWeight) / (initialWeight - goalWeight)) * 100
		return progress.toFixed(1)
	}

	if (initialWeight < goalWeight) {
		const progress =
			((currentWeight - initialWeight) / (goalWeight - initialWeight)) * 100
		return progress.toFixed(1)
	}

	return 100
}
