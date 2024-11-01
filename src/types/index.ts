import { daysOfWeek } from '~/lib/utils'
import { exerciseCategory } from '~/server/db/schema'

export type Sex = 'male' | 'female'
export type Goal = 'gain' | 'maintain' | 'lose'
export type ActivityLevel = 'sedentary' | 'moderate' | 'active'
export type Unit = 'kg' | 'lb' | 'cm' | 'ft'
export type Weights = Array<{ value: number; date: string; unit: Unit }>

export type ExerciseCategories = Array<typeof exerciseCategory.$inferSelect>

export interface NutritionMetrics {
	calories: {
		needed: number
		consumed: number
	}
	protein: {
		needed: number
		consumed: number
	}
	fats: {
		needed: number
		consumed: number
	}
	carbs: {
		needed: number
		consumed: number
	}
}

export type PublicMetadata = {
	onboardingCompleted: boolean
	sex: Sex
	born: string
	goal: Goal
	height: number
	weights: Weights
	activity: ActivityLevel
	heightUnit: string
	updatedAt: string
	goalWeight: number
	weightUnit: string
}

export type NutritionMetricsPerDay = { [key: number]: NutritionMetrics }

export interface WeeklyNutrition {
	name: string
	carbs: number
	protein: number
	fats: number
	calories: number
}

export interface ExerciseMetricsData {
	totalEnergyBurned: number
	totalDuration: number
	exercisesThisWeek: number
	avgDuration: number
}

export type ExerciseDay = {
	date: string
	[key: string]: string | number
}
export interface ExerciseGraphicsData {
	weeklyEnergyBurned: Array<{ day: (typeof daysOfWeek)[number]; value: number }>
	exerciseFrequency: ExerciseDay[]
}
