import { NutritionCard } from '../_components/nutrition-card'
import { User } from '@clerk/nextjs/server'
import { getTodayNutritionMetrics } from '~/server/utils/nutrition'
import { NutritionCardsSkeleton } from '../_components/skeletons'

export async function NutritionCards({
	user: currentUser
}: {
	user: Promise<User | null>
}) {
	const user = await currentUser
	if (!user) return <NutritionCardsSkeleton />
	const nutrition = await getTodayNutritionMetrics(
		user.id,
		user?.publicMetadata
	)
	return (
		<div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
			{Object.entries(nutrition).map(([key, value]) => (
				<NutritionCard key={key} nutrient={value} name={key} />
			))}
		</div>
	)
}
