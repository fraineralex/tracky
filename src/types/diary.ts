export type EntryType = 'food' | 'exercise' | 'food_registration';

export type EffortLevel = 'easy' | 'moderate' | 'hard' | 'very hard';

export interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface ExerciseInfo {
  caloriesBurned: number;
  duration: number;
  category: string;
  effortLevel: EffortLevel;
}

export interface DiaryEntry {
  id: string;
  type: EntryType;
  time: string;
  date: string;
  title: string;
  description: string;
  mealType?: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  nutritionInfo?: NutritionInfo;
  exerciseInfo?: ExerciseInfo;
}

