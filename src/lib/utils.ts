import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ACTIVITY_FACTORS, EFFORT_LEVELS, GOAL_FACTORS } from '~/constants'
import { NutritionMetrics, PublicMetadata } from '~/types'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function calculateEnergyBurned({
	duration,
	effort,
	weight,
	weightUnit,
	age,
	sex,
	height,
	heightUnit,
	categoryMultiplier
}: {
	duration: number
	effort: string
	weight: number
	age: number
	sex: string
	height: number
	heightUnit: string
	weightUnit: string
	categoryMultiplier: number
}) {
	weight = weightUnit === 'kg' ? weight : weight * 0.453592

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
	weight,
	height,
	heightUnit,
	weightUnit,
	born,
	sex,
	activity,
	goal
}: PublicMetadata): NutritionMetrics {
	const age = new Date().getFullYear() - new Date(born).getFullYear()
	weight = weightUnit === 'kg' ? weight : weight * 0.453592

	if (heightUnit === 'ft') {
		height = height * 30.48
	} else if (heightUnit === 'in') {
		height = height * 2.54
	}

	const tmb =
		sex === 'male'
			? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
			: 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age

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
			remaining: calories,
			needed: calories
		},
		protein: {
			consumed: 0,
			remaining: protein,
			needed: protein
		},
		carbs: {
			consumed: 0,
			remaining: carbs,
			needed: carbs
		},
		fats: {
			consumed: 0,
			remaining: fats,
			needed: fats
		}
	}
}

export function round(value?: number, decimals = 0) {
	const factor = Math.pow(10, decimals)
	return Math.round(value ?? 0 * factor) / factor
}

export function getStreakNumber(arr: Date[]) {
	let streak = 0
	arr.forEach((date, index) => {
		if (index === arr.length - 1) streak++
		else {
			const nextDate = arr[index + 1]
			const diff = nextDate ? date.getTime() - nextDate.getTime() : 0
			if (diff === 86400000) streak++
			else return streak
		}
	})
	return streak
}
