import { currentUser } from '@clerk/nextjs/server'
import {
	FoodMeatricsSkeleton,
	NutritionCardsSkeleton,
	NutritionGraphicsSkeleton
} from '../_components/skeletons'
import {
	getTodayNutritionMetrics,
	getUserNutritionMetrics
} from '~/server/utils/nutrition'
import { NutritionCards } from './nutrition-cards'
import { Suspense } from 'react'
import { NutritionGraphicData } from '../_components/nutrition-graphic-data'

export async function FoodMeatrics() {
	const user = await currentUser()
	if (!user) return <FoodMeatricsSkeleton />
	const userMetadata = user.publicMetadata
	const nutritionMeatrics = getUserNutritionMetrics(user.id, userMetadata)
	const todayNutrition = getTodayNutritionMetrics(user.id, userMetadata)

	return (
		<>
			<Suspense fallback={<NutritionCardsSkeleton />}>
				<NutritionCards nutrition={todayNutrition} />
			</Suspense>
			<Suspense fallback={<NutritionGraphicsSkeleton />}>
				<NutritionGraphicData
					nutritionMeatrics={nutritionMeatrics}
					weightsChanges={userMetadata.weights}
				/>
			</Suspense>
		</>
	)
}
