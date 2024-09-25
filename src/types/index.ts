import { exerciseCategory } from '~/server/db/schema'

export type sex = 'male' | 'female'
export type goal = 'gain' | 'maintain' | 'lose'
export type activityLevel = 'sedentary' | 'moderate' | 'active'

export type ExerciseCategories = Array<typeof exerciseCategory.$inferSelect>

export interface NutritionMetrics {
	calories: {
		needed: number
		consumed: number
		remaining: number
	}
	protein: {
		needed: number
		consumed: number
		remaining: number
	}
	carbs: {
		needed: number
		consumed: number
		remaining: number
	}
	fats: {
		needed: number
		consumed: number
		remaining: number
	}
}

export type PublicMetadata = {
	sex: sex
	born: string
	goal: goal
	height: number
	weight: number
	activity: activityLevel
	heightUnit: string
	weightUnit: string
}
