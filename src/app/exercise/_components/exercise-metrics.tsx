import ExerciseCards from '~/app/exercise/_sections/exercise-cards'
import { db } from '~/server/db'
import { exercise, exerciseCategory } from '~/server/db/schema'
import { asc, eq } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'
import { Suspense } from 'react'
import {
	ExerciseCardSkeleton,
	ExerciseGraphicsSkeleton,
	ExerciseMetricsSkeleton
} from './skeletons'
import { ExerciseGraphicsData } from './exercise-graphics-data'

export async function ExerciseMetrics() {
	const user = await currentUser()
	if (!user) return <ExerciseMetricsSkeleton />

	const exercises = db
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

	return (
		<>
			<Suspense fallback={<ExerciseCardSkeleton />}>
				<ExerciseCards exercises={exercises} />
			</Suspense>
			<Suspense fallback={<ExerciseGraphicsSkeleton />}>
				<ExerciseGraphicsData exercises={exercises} />
			</Suspense>
		</>
	)
}
