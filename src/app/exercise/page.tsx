import ExerciseMetrics from '~/app/exercise/_sections/exercise-metrics'
import { Header } from '~/app/exercise/_sections/header'
import { ExerciseGraphics } from '~/app/exercise/_sections/exercise-graphics'
import { db } from '~/server/db'
import { diaryGroupEnum, exercise, exerciseCategory } from '~/server/db/schema'
import { asc, eq } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'
import { daysOfWeek, getAdjustedDay } from '~/lib/utils'
import { ExerciseGraphicsData, ExerciseMetricsData } from '~/types'

export default async function ExercisePage() {
	const user = await currentUser()
	if (!user) return null

	const exercises = await db
		.select({
			burned: exercise.energyBurned,
			duration: exercise.duration,
			group: exercise.diaryGroup,
			createdAt: exercise.createdAt,
			name: exerciseCategory.name
		})
		.from(exercise)
		.innerJoin(exerciseCategory, eq(exercise.categoryId, exerciseCategory.id))
		.where(eq(exercise.userId, user.id))
		.orderBy(asc(exercise.createdAt))

	const exerciseMetrics: ExerciseMetricsData = {
		totalEnergyBurned: 0,
		totalDuration: 0,
		exercisesThisWeek: 0,
		avgDuration: 0
	}

	const exerciseGraphicsData: ExerciseGraphicsData = {
		weeklyEnergyBurned: daysOfWeek
			.filter((_, index) => index <= getAdjustedDay(new Date()))
			.map(day => ({
				day,
				value: 0
			})),
		exerciseFrequency: [],
		timeCategories: diaryGroupEnum.enumValues
			.filter(name => name !== 'uncategorized')
			.map(name => ({
				name,
				sessions: 0
			}))
	}

	const dayOfWeek = new Date()
	dayOfWeek.setDate(dayOfWeek.getDate() - getAdjustedDay(dayOfWeek) - 1)

	for (const exercise of exercises) {
		exerciseMetrics.totalEnergyBurned += Number(exercise.burned)
		exerciseMetrics.totalDuration += Number(exercise.duration)

		if (exercise.createdAt >= dayOfWeek) exerciseMetrics.exercisesThisWeek++

		const exerciseDay = getAdjustedDay(exercise.createdAt)
		if (
			exerciseGraphicsData.weeklyEnergyBurned &&
			exerciseGraphicsData.weeklyEnergyBurned[exerciseDay]
		) {
			exerciseGraphicsData.weeklyEnergyBurned[exerciseDay].value += Number(
				exercise.burned
			)
		} else {
			exerciseGraphicsData.weeklyEnergyBurned[exerciseDay] = {
				day: daysOfWeek[exerciseDay]!,
				value: Number(exercise.burned)
			}
		}

		const formatedDate = exercise.createdAt.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		})

		let exerciseDayObj = exerciseGraphicsData.exerciseFrequency.find(
			exerciseDay => exerciseDay.date === formatedDate
		)

		if (exerciseDayObj) {
			if (!exerciseDayObj[exercise.name]) {
				const updatedExerciseFrequency =
					exerciseGraphicsData.exerciseFrequency.map(item => {
						if (item.date === formatedDate) {
							return {
								...item,
								[exercise.name]: exercise.duration
							}
						}

						return {
							...item,
							[exercise.name]: 0
						}
					})

				exerciseGraphicsData.exerciseFrequency = updatedExerciseFrequency
			}

			if (exerciseDayObj[exercise.name]) {
				exerciseDayObj[exercise.name] =
					exerciseDayObj[exercise.name] + exercise.duration

				const index = exerciseGraphicsData.exerciseFrequency.findIndex(
					value => value.date === exerciseDayObj?.date
				)
				exerciseGraphicsData.exerciseFrequency[index] = exerciseDayObj
			}
		}

		if (!exerciseDayObj) {
			exerciseDayObj = {
				date: formatedDate,
				[exercise.name]: exercise.duration
			}
			exerciseGraphicsData.exerciseFrequency.push(exerciseDayObj)
		}

		const timeCategory = exerciseGraphicsData.timeCategories.find(
			category => category.name === exercise.group
		)

		if (timeCategory) {
			timeCategory.sessions++
			const index = exerciseGraphicsData.timeCategories.findIndex(
				value => value.name === timeCategory?.name
			)

			exerciseGraphicsData.timeCategories[index] = timeCategory
		}

		exerciseMetrics.avgDuration =
			exerciseMetrics.totalDuration / exercises.length

		return (
			<section className='mx-auto min-h-screen w-full bg-background px-0 py-5 text-foreground lg:px-4 xl:ms-5'>
				<Header />
				<ExerciseMetrics metrics={exerciseMetrics} />
				<ExerciseGraphics exerciseData={exerciseGraphicsData} />
			</section>
		)
	}
}
