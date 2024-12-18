import { db } from '~/server/db'
import { DiaryTimeline } from './diary-timeline'
import {
	consumption,
	exercise,
	exerciseCategory,
	food
} from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'
import { DiaryEntry } from '~/types/diary'
import { DiaryTimelineSkeletonUI } from './skeletons'
import { format } from 'date-fns'
import { DailyUserStats } from '~/types'
import { computeDailyUserStats } from '~/lib/calculations'

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

	const fetchFood = db
		.select({
			calories: food.kcal,
			protein: food.protein,
			carbs: food.carbs,
			fat: food.fat,
			title: food.name,
			createdAt: food.createdAt
		})
		.from(food)
		.where(eq(food.userId, user.id))

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
			const calories =
				((Number(portion) / Number(servingSize)) * Number(kcal), 2)

			const proteinConsumed =
				((Number(portion) / Number(servingSize)) * Number(protein), 2)

			const carbsConsumed =
				((Number(portion) / Number(servingSize)) * Number(carbs), 2)

			const fatsConsumed =
				((Number(portion) / Number(servingSize)) * Number(fat), 2)

			const date = format(createdAt, 'MMMM do, yyyy')
			if (userDailyResume[date]) {
				userDailyResume[date].calories.consumed += calories
				userDailyResume[date].protein.consumed += proteinConsumed
				userDailyResume[date].fats.consumed += fatsConsumed
				userDailyResume[date].carbs.consumed += carbsConsumed
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
			if (userDailyResume[date]) {
				userDailyResume[date].exercise.burned += Number(burned)
				userDailyResume[date].exercise.duration += Number(duration)
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
		({ calories, carbs, createdAt, fat, protein, title }) => ({
			type: 'food',
			title,
			diaryGroup: 'New Food Registration',
			createdAt,
			nutritionInfo: {
				calories: Number(calories).toFixed(),
				protein: Number(protein).toFixed(),
				fat: Number(fat).toFixed(),
				carbs: Number(carbs).toFixed()
			}
		})
	)

	const diaryEntries = [...entryMeals, ...entryExercises, ...foodEntries].sort(
		(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
	)

	return (
		<DiaryTimeline
			diaryEntries={diaryEntries}
			userDailyResume={userDailyResume}
		/>
	)
}
