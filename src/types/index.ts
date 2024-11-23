import { daysOfWeek } from '~/lib/utils'
import { diaryGroupEnum, exerciseCategory } from '~/server/db/schema'

export type Sex = 'male' | 'female'
export type Goal = 'gain' | 'maintain' | 'lose'
export type ActivityLevel = 'sedentary' | 'moderate' | 'active'
export type Unit = 'kg' | 'lb' | 'cm' | 'ft' | 'm' | 'ft, in' | 'in'
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

export interface TimeCategory {
	name: (typeof diaryGroupEnum.enumValues)[number]
	sessions: number
}

export interface MonthlyProgress {
	week: string
	energyBurned: number
	time: number
}

export interface ExerciseGraphicsData {
	weeklyEnergyBurned: Array<{ day: (typeof daysOfWeek)[number]; value: number }>
	exerciseFrequency: ExerciseDay[]
	timeCategories: TimeCategory[]
	monthlyProgress: MonthlyProgress[]
}

export interface SuccessLogData {
	successMessage: string
	title: string
	subTitle: string
	subTitleUnit?: string
	items: {
		name: 'Calories' | 'Protein' | 'Carbs' | 'Fats' | string
		amount: string
		unit?: string
	}[]
}

export interface SettingsMenuItem {
	name: string
	label: string
	description: string
	defaultValue: string | number | Date
	group: string
}

export type SettingsFieldType = 'date' | 'select' | 'number' | 'range'
export interface SettingsAttr {
	name: string
	type: SettingsFieldType
	label?: string
	unit?: Unit
	placeholder?: string
	options?: Array<{ key: string; label: string } | string>
	min?: number
	max?: number
	value: Date | string | number
	updateValue?: (value: Date | string | number) => void
}

export interface AboutMenuItem {
	name: string
	label: string
	attr: SettingsAttr
}

export type FieldTypes = Record<
	SettingsFieldType,
	React.FC<{ attr: SettingsAttr }>
>
