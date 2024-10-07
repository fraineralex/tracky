import { NutritionMetrics } from '~/types'
import { NutritionCard } from '../_components/nutrition-card'

export function NutritionCards({ nutrition }: { nutrition: NutritionMetrics }) {
	return (
		<div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
			{Object.entries(nutrition).map(([key, value]) => (
				<NutritionCard key={key} nutrient={value} />
			))}
		</div>
	)
}
