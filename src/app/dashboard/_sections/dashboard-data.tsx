import { currentUser, User } from '@clerk/nextjs/server'
import { getUserNutritionMetrics } from '~/server/utils/nutrition'
import {
	DataAndHabitsSkeleton,
	InsightsAndAnaliticsSkeleton,
	NutritionGraphicSkeleton
} from '../_components/skeletons'
import NutritionGraphic from './nutrition-graphic'
import InsightsAndAnalitics from './insights-analytics'
import { Suspense } from 'react'
import DataAndHabits from './data-habits'
import { connection } from 'next/server'

export async function DashboardData() {
	await connection()
	const user = currentUser()
	return (
		<>
			<div className='mt-4 flex-col space-x-3 space-y-3 sm:mt-0 md:flex-row md:pt-2 lg:flex lg:justify-between'>
				<Suspense fallback={<NutritionGraphicSkeleton />}>
					<NutritionMetrics user={user} />
				</Suspense>
				<Suspense fallback={<InsightsAndAnaliticsSkeleton />}>
					<InsightsAndAnalitics user={user} />
				</Suspense>
			</div>
			<Suspense fallback={<DataAndHabitsSkeleton />}>
				<DataAndHabits user={user} />
			</Suspense>
		</>
	)
}

export async function NutritionMetrics({
	user: currentUser
}: {
	user: Promise<User | null>
}) {
	const user = await currentUser
	if (!user) return <NutritionGraphicSkeleton />
	const nutritionMetrics = await getUserNutritionMetrics(
		user.id,
		user.publicMetadata
	)
	return <NutritionGraphic nutritionMetrics={nutritionMetrics} />
}
