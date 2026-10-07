import NutritionGraphic from '../sections/nutrition-graphics'
import { type User } from '@clerk/nextjs/server'
import { NutritionGraphicSkeleton } from '~/app/[lang]/dashboard/_components/skeletons'
import { getUserNutritionMetrics } from '~/server/utils/nutrition'
import { resolveUserProfile } from '~/server/user-profile'

export async function NutritionGraphicData({
	user: currentUser
}: {
	user: Promise<User | null>
}) {
	const user = await currentUser
	if (!user) return <NutritionGraphicSkeleton />
	const profile = await resolveUserProfile(user.id, user.publicMetadata)
	if (!profile) return <NutritionGraphicSkeleton />
	const nutritionMeatrics = await getUserNutritionMetrics(user.id, profile)
	return (
		<NutritionGraphic
			nutritionMeatrics={nutritionMeatrics}
			weightsChanges={profile.weights}
		/>
	)
}
