import { User } from '@clerk/nextjs/server'
import { NutritionGraphicSkeleton } from './skeletons'
import { getUserNutritionMetrics } from '~/server/utils/nutrition'
import NutritionGraphic from '../_sections/nutrition-graphic'

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
