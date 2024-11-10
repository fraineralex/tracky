import { LucideProps } from 'lucide-react'
import { ForwardRefExoticComponent, JSX, RefAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { daysOfWeek } from '~/lib/utils'
import { diaryGroupEnum, exerciseCategory } from '~/server/db/schema'

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
	icon: React.ElementType
	label: string
	description: string
	schema: z.ZodTypeAny
	formFields: (form: ReturnType<typeof useForm>) => JSX.Element
	defaultValue: string | number | Date
	formatValue: (value: string | number | Date) => string
	group: string
}

export type SettingsFieldType = 'date' | 'select' | 'number' | 'range'
export interface SettingsAttr {
	name: string
	type: SettingsFieldType
	label?: string
	placeholder?: string
	options?: Array<{ key: string; label: string } | string>
	min?: number
	max?: number
}

export interface AboutMenuItem {
	icon: ForwardRefExoticComponent<
		Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
	>
	label: string
	description: string
	action?: () => string
	content?: JSX.Element
}
