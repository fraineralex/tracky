import { currentUser } from '@clerk/nextjs/server'
import { calculateNeededCalories } from '~/lib/calculations'
import { getUserNutritionMetrics } from '~/server/utils/nutrition'
import {
	DashboardDataSkeleton,
	DataAndHabitsSkeleton,
	InsightsAndAnaliticsSkeleton,
	NutritionGraphicSkeleton
} from '../_components/skeletons'
import NutritionGraphic from './nutrition-graphic'
import InsightsAndAnalitics from './insights-analytics'
import { Suspense } from 'react'
import DataAndHabits from './data-habits'

export async function DashboardData() {
	const user = await currentUser()
	if (!user) return <DashboardDataSkeleton />
	const userMetadata = user.publicMetadata
	const expenditure = calculateNeededCalories(userMetadata)
	const nutritionMeatrics = getUserNutritionMetrics(user.id, userMetadata)

	return (
		<>
			<div className='mt-4 flex-col space-x-3 space-y-3 sm:mt-0 md:flex-row md:pt-2 lg:flex lg:justify-between'>
				<Suspense fallback={<NutritionGraphicSkeleton />}>
					<NutritionGraphic nutritionMetrics={await nutritionMeatrics} />
				</Suspense>
				<Suspense fallback={<InsightsAndAnaliticsSkeleton />}>
					<InsightsAndAnalitics expenditure={expenditure} {...userMetadata} />
				</Suspense>
			</div>
			<Suspense fallback={<DataAndHabitsSkeleton />}>
				<DataAndHabits expenditure={expenditure} userMetadata={userMetadata} />
			</Suspense>
		</>
	)
}
