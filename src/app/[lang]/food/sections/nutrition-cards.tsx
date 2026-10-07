import { NutritionCard } from '../_components/nutrition-card'
import { type User } from '@clerk/nextjs/server'
import { getTodayNutritionMetrics } from '~/server/utils/nutrition'
import { resolveUserProfile } from '~/server/user-profile'
import { NutritionCardsSkeleton } from '../_components/skeletons'
import { getDictionary } from '~/get-dictionary'
import { type Locale } from '~/i18n-config'

export async function NutritionCards({
	user: currentUser,
	lang
}: {
	user: Promise<User | null>
	lang: Locale
}) {
	const user = await currentUser
	if (!user) return <NutritionCardsSkeleton />
	const profile = await resolveUserProfile(user.id, user.publicMetadata)
	if (!profile) return <NutritionCardsSkeleton />
	const [nutrition, dictionary] = await Promise.all([
		getTodayNutritionMetrics(user.id, profile),
		getDictionary(lang)
	])

	const nutritionLabels: Record<string, string> = {
		calories: dictionary.common.nutrition.calories,
		protein: dictionary.common.nutrition.protein,
		carbs: dictionary.common.nutrition.carbs,
		fats: dictionary.common.nutrition.fats
	}

	return (
		<div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
			{(
				Object.entries(nutrition) as Array<
					[
						keyof typeof nutritionLabels,
						(typeof nutrition)[keyof typeof nutrition]
					]
				>
			).map(([key, value]) => (
				<NutritionCard
					key={key}
					nutrient={value}
					name={nutritionLabels[key] ?? key}
					iconKey={key}
					ofDailyGoalLabel={dictionary.food.card.ofDailyGoal}
				/>
			))}
		</div>
	)
}
