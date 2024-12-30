import { currentUser } from '@clerk/nextjs/server'
import {
	DataAndHabitsSkeleton,
	InsightsAndAnaliticsSkeleton,
	NutritionGraphicSkeleton
} from './skeletons'
import InsightsAndAnalitics from '../_sections/insights-analytics'
import { Suspense } from 'react'
import DataAndHabits from '../_sections/data-habits'
import { connection } from 'next/server'
import { NutritionMetrics } from './nutrition-metrics'

export async function DashboardData() {
	await connection()
	const user = currentUser()

	return (
		<>
			<div className='mt-4 flex-col gap-x-3 sm:mt-0 md:flex-row lg:flex lg:justify-between'>
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
