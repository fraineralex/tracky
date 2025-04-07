import { db } from '~/server/db'
import { DiaryTimeline } from './diary-timeline'
import {
	consumption,
	exercise,
	exerciseCategory,
	food
} from '~/server/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'
import { DiaryEntry } from '~/types/diary'
import { DiaryTimelineSkeletonUI } from './skeletons'
import { format } from 'date-fns'
import { DailyUserStats } from '~/types'
import { computeDailyUserStats } from '~/lib/calculations'
import { formatHeight } from '~/lib/utils'

export async function DiaryTimelineData() {
	const user = await currentUser()
	if (!user) return <DiaryTimelineSkeletonUI />
	const userMetadata = user.publicMetadata

	const fetchMeals = db
		.select({
			portion: consumption.portion,
			createdAt: consumption.createdAt,
			servingSize: food.servingSize,
			kcal: food.kcal,
			protein: food.protein,
			carbs: food.carbs,
			fat: food.fat,
			title: food.name,
			diaryGroup: consumption.mealGroup
		})
		.from(consumption)
		.innerJoin(food, eq(consumption.foodId, food.id))
		.where(and(eq(consumption.userId, user.id)))
		.orderBy(desc(consumption.createdAt))
		.limit(50)

	const fetchExercise = db
		.select({
			burned: exercise.energyBurned,
			duration: exercise.duration,
			diaryGroup: exercise.diaryGroup,
			createdAt: exercise.createdAt,
			title: exerciseCategory.name,
			effort: exercise.effort
		})
		.from(exercise)
		.innerJoin(exerciseCategory, eq(exercise.categoryId, exerciseCategory.id))
		.where(eq(exercise.userId, user.id))
		.orderBy(desc(exercise.createdAt))
		.limit(50)

	const fetchFood = db
		.select({
			calories: food.kcal,
			protein: food.protein,
			carbs: food.carbs,
			fat: food.fat,
			foodName: food.name,
			createdAt: food.createdAt
		})
		.from(food)
		.where(eq(food.userId, user.id))
		.orderBy(desc(food.createdAt))
		.limit(50)

	const [meals, exercises, foodRegistries] = await Promise.all([
		fetchMeals,
		fetchExercise,
		fetchFood
	])

	const userDailyResume: { [key: string]: DailyUserStats } = {}
	const entryMeals: DiaryEntry[] = meals.map(
		({
			portion,
			createdAt,
			servingSize,
			kcal,
			protein,
			carbs,
			fat,
			title,
			diaryGroup
		}) => {
			const calories = (Number(portion) / Number(servingSize)) * Number(kcal)

			const proteinConsumed =
				(Number(portion) / Number(servingSize)) * Number(protein)

			const carbsConsumed =
				(Number(portion) / Number(servingSize)) * Number(carbs)

			const fatsConsumed = (Number(portion) / Number(servingSize)) * Number(fat)

			const date = format(createdAt, 'MMMM do, yyyy')
			const userResumeDay = userDailyResume[date]
			if (userResumeDay) {
				userResumeDay.calories.consumed += calories
				userResumeDay.protein.consumed += proteinConsumed
				userResumeDay.fats.consumed += fatsConsumed
				userResumeDay.carbs.consumed += carbsConsumed
			} else {
				const nutritionMetrics = computeDailyUserStats({
					...userMetadata,
					date: createdAt
				})
				nutritionMetrics.calories.consumed = calories
				nutritionMetrics.protein.consumed = proteinConsumed
				nutritionMetrics.fats.consumed = fatsConsumed
				nutritionMetrics.carbs.consumed = carbsConsumed
				userDailyResume[date] = nutritionMetrics
			}

			return {
				type: 'meal',
				createdAt,
				title,
				diaryGroup,
				nutritionInfo: {
					calories: calories.toLocaleString(),
					protein: proteinConsumed.toLocaleString(),
					fat: fatsConsumed.toLocaleString(),
					carbs: carbsConsumed.toLocaleString()
				}
			}
		}
	)

	const entryExercises: DiaryEntry[] = exercises.map(
		({ title, burned, createdAt, duration, diaryGroup, effort }) => {
			const date = format(createdAt, 'MMMM do, yyyy')
			const userResumeDay = userDailyResume[date]
			if (userResumeDay) {
				userResumeDay.exercise.burned += Number(burned)
				userResumeDay.exercise.duration += Number(duration)
			} else {
				const nutritionMetrics = computeDailyUserStats({
					...userMetadata,
					date: createdAt
				})
				nutritionMetrics.exercise.burned = Number(burned)
				nutritionMetrics.exercise.duration = Number(duration)
				userDailyResume[date] = nutritionMetrics
			}
			return {
				type: 'exercise',
				createdAt,
				title,
				diaryGroup,
				exerciseInfo: {
					burned: Number(burned).toFixed(),
					duration: Number(duration).toFixed(),
					effort
				}
			}
		}
	)

	const foodEntries: DiaryEntry[] = foodRegistries.map(
		({ calories, carbs, createdAt, fat, protein, foodName }) => ({
			type: 'food',
			title: 'New Food Registration',
			diaryGroup: foodName,
			createdAt,
			nutritionInfo: {
				calories: Number(calories).toFixed(),
				protein: Number(protein).toFixed(),
				fat: Number(fat).toFixed(),
				carbs: Number(carbs).toFixed()
			}
		})
	)

	const { activity, fat, goal, goalWeight, height, weights } = userMetadata
	const metadataEntries = [
		...activity.map(({ value, date }, index) => ({
			title: `${index === 0 ? 'Start' : 'New'} Activity Level`,
			type: 'activity' as const,
			diaryGroup: value satisfies string,
			createdAt: new Date(date)
		})),
		...fat.map(({ value, date }, index) => ({
			title: `${index === 0 ? 'Start' : 'New'} Body Fat Percentage`,
			type: 'fat' as const,
			diaryGroup: `${value.toFixed(1)}%`,
			createdAt: new Date(date)
		})),
		...goal.map(({ value, date }, index) => ({
			title: `${index === 0 ? 'Start' : 'New'} Goal`,
			type: 'goal' as const,
			diaryGroup: value satisfies string,
			createdAt: new Date(date)
		})),
		...goalWeight.map(({ value, date }, index) => ({
			title: `${index === 0 ? 'Start' : 'New'} Goal Weight`,
			type: 'goal' as const,
			diaryGroup: `${value} KG`,
			createdAt: new Date(date)
		})),
		...height.map(({ value, date }, index) => ({
			title: `${index === 0 ? 'Start' : 'New'} Height`,
			type: 'height' as const,
			diaryGroup: formatHeight(value),
			createdAt: new Date(date)
		})),
		...weights.map(({ value, date }, index) => ({
			title: `${index === 0 ? 'Start' : 'New'} Weight`,
			type: 'weight' as const,
			diaryGroup: `${value} KG`,
			createdAt: new Date(date)
		}))
	]

	const diaryEntries = [
		...entryMeals,
		...entryExercises,
		...foodEntries,
		...metadataEntries
	].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

	return (
		<DiaryTimeline
			diaryEntries={diaryEntries}
			userDailyResume={userDailyResume}
		/>
	)
}
