import { type User } from '@clerk/nextjs/server'
import { NutritionGraphicSkeleton } from './skeletons'
import { getUserNutritionMetrics } from '~/server/utils/nutrition'
import { resolveUserProfile } from '~/server/user-profile'
import NutritionGraphic from '../_sections/nutrition-graphic'
import { Suspense } from 'react'

export async function NutritionMetrics({
	user: currentUser
}: {
	user: Promise<User | null>
}) {
	const user = await currentUser
	if (!user) return <NutritionGraphicSkeleton />
	const profile = await resolveUserProfile(user.id, user.publicMetadata)
	if (!profile) return <NutritionGraphicSkeleton />
	const nutritionMetrics = await getUserNutritionMetrics(user.id, profile)

	return (
		<Suspense fallback={<NutritionGraphicSkeleton />}>
			<NutritionGraphic nutritionMetrics={nutritionMetrics} />
		</Suspense>
	)
}
