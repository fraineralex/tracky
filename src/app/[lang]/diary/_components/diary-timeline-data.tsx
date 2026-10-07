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
import { resolveUserProfile } from '~/server/user-profile'
import { type DiaryEntry } from '~/types/diary'
import { DiaryTimelineSkeletonUI } from './skeletons'
import { format } from 'date-fns'
import { type DailyUserStats } from '~/types'
import { computeDailyUserStats } from '~/lib/calculations'
import { formatHeight } from '~/lib/utils'
import { getDictionary } from '~/get-dictionary'
import { type Locale, i18n } from '~/i18n-config'

export async function DiaryTimelineData({ lang }: { lang?: Locale }) {
	const user = await currentUser()
	if (!user) return <DiaryTimelineSkeletonUI />
	const userMetadata = await resolveUserProfile(user.id, user.publicMetadata)
	if (!userMetadata) return <DiaryTimelineSkeletonUI />

	const locale = lang && i18n.locales.includes(lang) ? lang : i18n.defaultLocale
	const dictionary = await getDictionary(locale)

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
			titleEs: food.nameEs,
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
			foodNameEs: food.nameEs,
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

	const userDailyResume: Record<string, DailyUserStats> = {}
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
			titleEs,
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

			// Usar título en español si el locale es 'es' y existe traducción
			const displayTitle = locale === 'es' && titleEs ? titleEs : title

			return {
				type: 'meal',
				createdAt,
				title: displayTitle,
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
		({ calories, carbs, createdAt, fat, protein, foodName, foodNameEs }) => {
			// Usar nombre en español si el locale es 'es' y existe traducción
			const displayFoodName =
				locale === 'es' && foodNameEs ? foodNameEs : foodName

			return {
				type: 'food',
				title: dictionary.diary.entries.newFoodRegistration,
				diaryGroup: displayFoodName,
				createdAt,
				nutritionInfo: {
					calories: Number(calories).toFixed(),
					protein: Number(protein).toFixed(),
					fat: Number(fat).toFixed(),
					carbs: Number(carbs).toFixed()
				}
			}
		}
	)

	const { activity, fat, goal, goalWeight, height, weights } = userMetadata
	const metadataEntries = [
		...activity.map(({ value, date }, index) => ({
			title:
				index === 0
					? dictionary.diary.entries.startActivityLevel
					: dictionary.diary.entries.newActivityLevel,
			type: 'activity' as const,
			diaryGroup: value satisfies string,
			createdAt: new Date(date)
		})),
		...fat.map(({ value, date }, index) => ({
			title:
				index === 0
					? dictionary.diary.entries.startBodyFat
					: dictionary.diary.entries.newBodyFat,
			type: 'fat' as const,
			diaryGroup: `${value.toFixed(1)}%`,
			createdAt: new Date(date)
		})),
		...goal.map(({ value, date }, index) => ({
			title:
				index === 0
					? dictionary.diary.entries.startGoal
					: dictionary.diary.entries.newGoal,
			type: 'goal' as const,
			diaryGroup: value satisfies string,
			createdAt: new Date(date)
		})),
		...goalWeight.map(({ value, date }, index) => ({
			title:
				index === 0
					? dictionary.diary.entries.startGoalWeight
					: dictionary.diary.entries.newGoalWeight,
			type: 'goal' as const,
			diaryGroup: `${value} ${dictionary.common.units.kg.toUpperCase()}`,
			createdAt: new Date(date)
		})),
		...height.map(({ value, date }, index) => ({
			title:
				index === 0
					? dictionary.diary.entries.startHeight
					: dictionary.diary.entries.newHeight,
			type: 'height' as const,
			diaryGroup: formatHeight(value),
			createdAt: new Date(date)
		})),
		...weights.map(({ value, date }, index) => ({
			title:
				index === 0
					? dictionary.diary.entries.startWeight
					: dictionary.diary.entries.newWeight,
			type: 'weight' as const,
			diaryGroup: `${value} ${dictionary.common.units.kg.toUpperCase()}`,
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
