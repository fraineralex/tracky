import {
	ACTIVITY_FACTORS,
	EFFORT_LEVELS,
	GOAL_FACTORS,
	MACRO_DISTRIBUTION
} from '~/constants'
import { DailyUserStats, NutritionMetrics } from '~/types'

export function calculateBodyFat({
	sex,
	born,
	height,
	weights
}: UserPublicMetadata) {
	const weightInKg = weights[weights.length - 1]?.value ?? 0
	const [heightFt, heightIn] = (height[height.length - 1]?.value ?? 0.0)
		.toString()
		.split('.')
	const heightInMeters =
		(Number(heightFt ?? 0) * 30.48 + Number(heightIn ?? 0) * 2.54) / 100
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
	const initialWeight = weights[0]?.value || 0
	const currentWeight = weights[weights.length - 1]?.value || 0
	const currentGoalWeight = goalWeight[goalWeight.length - 1]?.value || 0

	if (initialWeight > currentGoalWeight) {
		const progress =
			((initialWeight - currentWeight) / (initialWeight - currentGoalWeight)) *
			100
		return round(progress, 1)
	}

	if (initialWeight < currentGoalWeight) {
		const progress =
			((currentWeight - initialWeight) / (currentGoalWeight - initialWeight)) *
			100
		return round(progress, 1)
	}

	return 100
}

export function calculateDuration(minutes: number) {
	const hours = minutes >= 60 ? `${Math.floor(minutes / 60)}h` : ''
	const mins = minutes % 60 !== 0 || minutes === 0 ? `${minutes % 60}m` : ''
	return `${hours} ${mins}`
}

export function calculateStreak(arr: number[]) {
	let streak = 0
	const todayTime = new Date().setHours(0, 0, 0, 0)

	for (const [index, time] of arr.entries()) {
		if (arr.length === 1) {
			if (todayTime === time) return streak++
		}
		const beforeDate = arr[index + 1]
		const diff = beforeDate ? time - beforeDate : 0
		if (diff === 86400000) {
			streak++
			continue
		}

		if (index === arr.length - 1 && streak === 0 && todayTime === arr[0])
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
	age,
	sex,
	height,
	categoryMultiplier
}: {
	duration: number
	effort: string
	currentWeight: number
	age: number
	sex: string
	height: number
	categoryMultiplier: number
}) {
	const [heightFt, heightIn] = height.toString().split('.')
	const heightInMeters =
		(Number(heightFt ?? 0) * 30.48 + Number(heightIn ?? 0) * 2.54) / 100
	const tmb = calculateTMB(currentWeight, heightInMeters, age, sex)

	const effortMultiplier =
		EFFORT_LEVELS[effort as keyof typeof EFFORT_LEVELS].multiplier

	const caloriesPerMinute =
		(tmb / (24 * 60)) * effortMultiplier * categoryMultiplier

	return (duration * caloriesPerMinute).toFixed(0)
}

export function calculateNutritionalNeeds({
	weights,
	height,
	born,
	sex,
	activity,
	goal
}: UserPublicMetadata): NutritionMetrics {
	const currentWeight = weights[weights.length - 1]?.value ?? 0
	const age = new Date().getFullYear() - new Date(born).getFullYear()
	const [heightFt, heightIn] = (height[height.length - 1]?.value ?? 0.0)
		.toString()
		.split('.')
	const heightInMeters =
		(Number(heightFt ?? 0) * 30.48 + Number(heightIn ?? 0) * 2.54) / 100
	const currentActivity = activity[activity.length - 1]?.value ?? 'moderate'
	const currentGoal = goal[goal.length - 1]?.value ?? 'maintain'

	const tmb = calculateTMB(currentWeight, heightInMeters, age, sex)

	const adjustedGet =
		tmb * ACTIVITY_FACTORS[currentActivity] * GOAL_FACTORS[currentGoal]

	const proteinCalories = adjustedGet * MACRO_DISTRIBUTION.protein
	const carbCalories = adjustedGet * MACRO_DISTRIBUTION.carbs
	const fatCalories = adjustedGet * MACRO_DISTRIBUTION.fats

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

export function calculateNeededCalories(
	{ weights, height, born, sex, activity, goal }: UserPublicMetadata,
	{ isExpenditure }: { isExpenditure: boolean } = { isExpenditure: false }
): number {
	const currentWeight = weights[weights.length - 1]?.value ?? 0
	const age = new Date().getFullYear() - new Date(born).getFullYear()
	const [heightFt, heightIn] = (height[height.length - 1]?.value ?? 0.0)
		.toString()
		.split('.')
	const heightInMeters =
		(Number(heightFt ?? 0) * 30.48 + Number(heightIn ?? 0) * 2.54) / 100
	const currentActivity = activity[activity.length - 1]?.value ?? 'moderate'
	const currentGoal = goal[goal.length - 1]?.value ?? 'maintain'

	const tmb = calculateTMB(currentWeight, heightInMeters, age, sex)

	return round(
		tmb *
			ACTIVITY_FACTORS[currentActivity] *
			(isExpenditure ? 1 : GOAL_FACTORS[currentGoal])
	)
}

interface UserData extends UserPublicMetadata {
	date: Date
}

type MetricWithDate<T> = { date: string; value: T }[]

function findValueAtDate<T>(
	metrics: MetricWithDate<T>,
	date: Date,
	defaultValue: T
): T {
	if (metrics.length === 0) return defaultValue
	if (metrics.length === 1) return metrics[0]?.value ?? defaultValue

	return (
		metrics
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
			.find(m => new Date(m.date).getTime() <= date.getTime())?.value ??
		defaultValue
	)
}

function calculateHeightInMeters(height: number): number {
	const [heightFt, heightIn] = height?.toString().split('.') || [height, '0']
	return (
		(Number(heightFt ?? height) * 30.48 + Number(heightIn ?? 0) * 2.54) / 100
	)
}

function calculateTMB(
	weight: number,
	heightInMeters: number,
	age: number,
	sex: string
): number {
	return sex === 'male'
		? 88.362 + 13.397 * weight + 4.799 * heightInMeters * 100 - 5.677 * age
		: 447.593 + 9.247 * weight + 3.098 * heightInMeters * 100 - 4.33 * age
}

export function computeDailyUserStats({
	weights,
	height,
	born,
	sex,
	activity,
	goal,
	date
}: UserData): DailyUserStats {
	const weight = findValueAtDate(weights, date, 0)
	const currentActivity = findValueAtDate(activity, date, 'moderate')
	const currentGoal = findValueAtDate(goal, date, 'maintain')
	const dateHeight = findValueAtDate(height, date, 0)

	const age = date.getFullYear() - new Date(born).getFullYear()
	const heightInMeters = calculateHeightInMeters(dateHeight)
	const tmb = calculateTMB(weight, heightInMeters, age, sex)

	const maintainedGet = tmb * ACTIVITY_FACTORS[currentActivity]
	const adjustedGet = maintainedGet * GOAL_FACTORS[currentGoal]

	return {
		calories: { consumed: 0, needed: round(adjustedGet) },
		protein: {
			consumed: 0,
			needed: round((adjustedGet * MACRO_DISTRIBUTION.protein) / 4)
		},
		carbs: {
			consumed: 0,
			needed: round((adjustedGet * MACRO_DISTRIBUTION.carbs) / 4)
		},
		fats: {
			consumed: 0,
			needed: round((adjustedGet * MACRO_DISTRIBUTION.fats) / 9)
		},
		exercise: {
			burned: 0,
			needed: round(maintainedGet),
			duration: 0
		}
	}
}
