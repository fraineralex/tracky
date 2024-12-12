import { diaryGroupEnum, effortEnum } from '~/server/db/schema'

export type EntryType = 'meal' | 'exercise' | 'food'

export interface NutritionInfo {
	calories: string
	protein: string
	fat: string
	carbs: string
}

export interface ExerciseInfo {
	burned: string
	duration: string
	effort: typeof effortEnum.enumValues[number]
}

export interface DiaryEntry {
	type: EntryType
	createdAt: Date
	title: string
	diaryGroup: string
	mealType?: typeof diaryGroupEnum.enumValues[number]
	nutritionInfo?: NutritionInfo
	exerciseInfo?: ExerciseInfo
}
