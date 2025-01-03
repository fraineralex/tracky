'use cache'

import { addDays, format, startOfWeek } from 'date-fns'
import { daysOfWeek } from '~/constants'
import { calculateAdjustedDay } from '~/lib/calculations'
import { diaryGroupEnum } from '~/server/db/schema'
import { ExerciseCall, ExerciseGraphicsData as Data } from '~/types'
import { ExerciseGraphics } from '../_sections/exercise-graphics'

export async function ExerciseGraphicsData({
	exercises: exercisesPromise,
	userMetadata
}: {
	exercises: Promise<ExerciseCall>
	userMetadata: UserPublicMetadata
}) {
	const exercises = await exercisesPromise

	const exerciseGraphicsData: Data = {
		weeklyEnergyBurned: daysOfWeek
			.filter((_, index) => index <= calculateAdjustedDay(new Date()))
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
			})),
		monthlyProgress: []
	}

	const dayOfWeek = new Date()
	dayOfWeek.setDate(dayOfWeek.getDate() - calculateAdjustedDay(dayOfWeek) - 1)

	for (const exercise of exercises) {
		const exerciseDay = calculateAdjustedDay(exercise.createdAt)
		if (
			exerciseGraphicsData.weeklyEnergyBurned &&
			exerciseGraphicsData.weeklyEnergyBurned[exerciseDay]
		) {
			exerciseGraphicsData.weeklyEnergyBurned[exerciseDay]!.value += Number(
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

		const startOfWeekDate = startOfWeek(exercise.createdAt, { weekStartsOn: 1 })
		const endOfWeekDate = addDays(startOfWeekDate, 6)
		const weekLabel = `${format(startOfWeekDate, 'dd MMM')} - ${format(endOfWeekDate, 'dd MMM')}`
		const monthlyProgress = exerciseGraphicsData.monthlyProgress.find(
			progress => progress.week === weekLabel
		)

		if (monthlyProgress) {
			monthlyProgress.energyBurned += Number(exercise.burned)
			monthlyProgress.time += Number(exercise.duration)
			const index = exerciseGraphicsData.monthlyProgress.findIndex(
				value => value.week === monthlyProgress?.week
			)

			exerciseGraphicsData.monthlyProgress[index] = monthlyProgress
		}

		if (!monthlyProgress) {
			exerciseGraphicsData.monthlyProgress.push({
				week: weekLabel,
				energyBurned: Number(exercise.burned),
				time: Number(exercise.duration)
			})
		}
	}

	return (
		<ExerciseGraphics
			exerciseData={exerciseGraphicsData}
			userMetadata={userMetadata}
		/>
	)
}
