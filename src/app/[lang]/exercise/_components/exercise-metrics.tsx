import ExerciseCards from '~/app/[lang]/exercise/_sections/exercise-cards'
import { db } from '~/server/db'
import { exercise, exerciseCategory } from '~/server/db/schema'
import { asc, eq } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'
import { resolveUserProfile } from '~/server/user-profile'
import { Suspense } from 'react'
import {
	ExerciseCardSkeleton,
	ExerciseGraphicsSkeleton,
	ExerciseMetricsSkeleton
} from './skeletons'
import { ExerciseGraphicsData } from './exercise-graphics-data'
import { getDictionary } from '~/get-dictionary'
import { type Locale } from '~/i18n-config'

export async function ExerciseMetrics({ lang }: { lang: Locale }) {
	const user = await currentUser()
	if (!user) return <ExerciseMetricsSkeleton />
	const userMetadata = await resolveUserProfile(user.id, user.publicMetadata)
	if (!userMetadata) return <ExerciseMetricsSkeleton />

	const [exercises, dictionary] = await Promise.all([
		db
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
			.orderBy(asc(exercise.createdAt)),
		getDictionary(lang)
	])

	const exerciseCardsLabels = {
		totalEnergyBurned: dictionary.exercise.cards.totalEnergyBurned,
		totalExerciseTime: dictionary.exercise.cards.totalExerciseTime,
		avgSessionDuration: dictionary.exercise.cards.avgSessionDuration,
		exercisesThisWeek: dictionary.exercise.cards.exercisesThisWeek,
		times: dictionary.exercise.cards.times,
		kcal: dictionary.common.units.kcal
	}

	return (
		<>
			<Suspense fallback={<ExerciseCardSkeleton />}>
				<ExerciseCards
					exercises={Promise.resolve(exercises)}
					labels={exerciseCardsLabels}
				/>
			</Suspense>
			<Suspense fallback={<ExerciseGraphicsSkeleton />}>
				<ExerciseGraphicsData
					exercises={Promise.resolve(exercises)}
					userMetadata={userMetadata}
				/>
			</Suspense>
		</>
	)
}
