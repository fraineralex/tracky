import { ACTIVITY_FACTORS, EFFORT_LEVELS, GOAL_FACTORS } from '~/constants'
import { NutritionMetrics } from '~/types'

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

	return '100'
}

export function calculateDuration(minutes: number) {
	const hours = minutes >= 60 ? `${Math.floor(minutes / 60)}h` : ''
	const mins = minutes % 60 !== 0 ? `${minutes % 60}m` : ''
	return `${hours} ${mins}`
}

export function calculateStreak(arr: Date[]) {
	let streak = 0
	const today = new Date(new Date().setHours(0, 0, 0, 0))

	for (const [index, date] of arr.entries()) {
		if (arr.length === 1) {
			if (today.getTime() === date.getTime()) return streak++
		}
		const beforeDate = arr[index + 1]
		const diff = beforeDate ? date.getTime() - beforeDate.getTime() : 0
		if (diff === 86400000) {
			streak++
			continue
		}

		if (
			index === arr.length - 1 &&
			streak === 0 &&
			today.getTime() === arr[0]?.getTime()
		)
			streak++
	}

	return streak
}

export function round(value?: number, decimals = 0) {
	const factor = Math.pow(10, decimals)
	return Math.round(value ?? 0 * factor) / factor
}

export function calculateAdjustedDay(date: Date): number {
	const day = date.getDay()
	return day === 0 ? 6 : day - 1
}

export function calculatePercentage(nutrient: {
	consumed: number
	needed: number
}) {
	const consumptionRatio = nutrient.consumed / nutrient.needed
	return round(
		(consumptionRatio < 1 ? consumptionRatio : 1) * 100
	).toLocaleString()
}

export const calculateMacroPercentage = (
	macroConsumed: number,
	caloriesConsumed: number
) => {
	if (caloriesConsumed === 0) return 0
	return round((macroConsumed / caloriesConsumed) * 100)
}

export function calculateEnergyBurned({
	duration,
	effort,
	currentWeight,
	weightUnit,
	age,
	sex,
	height,
	heightUnit,
	categoryMultiplier
}: {
	duration: number
	effort: string
	currentWeight: number
	age: number
	sex: string
	height: number
	heightUnit: string
	weightUnit: string
	categoryMultiplier: number
}) {
	const weight = weightUnit === 'kg' ? currentWeight : currentWeight * 0.453592

	if (heightUnit === 'ft') {
		height = height * 30.48
	} else if (heightUnit === 'in') {
		height = height * 2.54
	}

	const tmb =
		sex === 'male'
			? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
			: 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age

	const effortMultiplier =
		EFFORT_LEVELS[effort as keyof typeof EFFORT_LEVELS].multiplier

	const caloriesPerMinute = (tmb / 1440) * effortMultiplier * categoryMultiplier

	return (duration * caloriesPerMinute).toFixed(0)
}

export function calculateNutritionalNeeds({
	weights,
	height,
	heightUnit,
	weightUnit,
	born,
	sex,
	activity,
	goal
}: UserPublicMetadata): NutritionMetrics {
	let currentWeight = weights[weights.length - 1]?.value ?? 0
	const age = new Date().getFullYear() - new Date(born).getFullYear()
	currentWeight = weightUnit === 'kg' ? currentWeight : currentWeight * 0.453592

	if (heightUnit === 'ft') {
		height = height * 30.48
	} else if (heightUnit === 'in') {
		height = height * 2.54
	}

	const tmb =
		sex === 'male'
			? 88.362 + 13.397 * currentWeight + 4.799 * height - 5.677 * age
			: 447.593 + 9.247 * currentWeight + 3.098 * height - 4.33 * age

	const get = tmb * ACTIVITY_FACTORS[activity]

	const adjustedGet = get * GOAL_FACTORS[goal]

	const proteinCalories = adjustedGet * 0.21
	const carbCalories = adjustedGet * 0.53
	const fatCalories = adjustedGet * 0.26

	const protein = round(proteinCalories / 4)
	const carbs = round(carbCalories / 4)
	const fats = round(fatCalories / 9)
	const calories = round(adjustedGet)

	return {
		calories: {
			consumed: 0,
			needed: calories
		},
		protein: {
			consumed: 0,
			needed: protein
		},
		carbs: {
			consumed: 0,
			needed: carbs
		},
		fats: {
			consumed: 0,
			needed: fats
		}
	}
}
