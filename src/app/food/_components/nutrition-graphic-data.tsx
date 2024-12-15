'use cache'

import { NutritionMetricsPerDay, Weights } from '~/types'
import NutritionGraphic from '../sections/nutrition-graphics'

export async function NutritionGraphicData({
	nutritionMeatrics,
	weightsChanges
}: {
	nutritionMeatrics: Promise<NutritionMetricsPerDay>
	weightsChanges: Weights
}) {
	return (
		<NutritionGraphic
			nutritionMeatrics={await nutritionMeatrics}
			weightsChanges={weightsChanges}
		/>
	)
}
