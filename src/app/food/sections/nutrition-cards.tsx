'use cache'

import { NutritionMetrics } from '~/types'
import { NutritionCard } from '../_components/nutrition-card'

export async function NutritionCards({
	nutrition
}: {
	nutrition: Promise<NutritionMetrics>
}) {
	return (
		<div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
			{Object.entries(await nutrition).map(([key, value]) => (
				<NutritionCard key={key} nutrient={value} name={key} />
			))}
		</div>
	)
}
