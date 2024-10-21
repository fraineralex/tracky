import ExerciseMetrics from '~/app/exercise/_sections/exercise-metrics'
import { Header } from '~/app/exercise/_sections/header'
import { ExerciseGraphics } from '~/app/exercise/_sections/exercise-graphics'
import { db } from '~/server/db'
import { exercise, exerciseCategory } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'
import { getAdjustedDay } from '~/lib/utils'
import { ExerciseMetricsData } from '~/types'

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

	const exerciseMetrics: ExerciseMetricsData = {
		totalEnergyBurned: 0,
		totalDuration: 0,
		exercisesThisWeek: 0,
		avgDuration: 0
	}

	const dayOfWeek = new Date()
	dayOfWeek.setDate(dayOfWeek.getDate() - getAdjustedDay(dayOfWeek) - 1)

	for (const exercise of exercises) {
		exerciseMetrics.totalEnergyBurned += Number(exercise.burned)
		exerciseMetrics.totalDuration += Number(exercise.duration)
		if (new Date(exercise.createdAt) >= dayOfWeek)
			exerciseMetrics.exercisesThisWeek++
	}

	exerciseMetrics.avgDuration = exerciseMetrics.totalDuration / exercises.length

	return (
		<section className='mx-auto min-h-screen w-full bg-background px-0 py-5 text-foreground lg:px-4 xl:ms-5'>
			<Header />
			<ExerciseMetrics metrics={exerciseMetrics} />
			<ExerciseGraphics />
		</section>
	)
}
