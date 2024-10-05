import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { getPercentage, round } from '~/lib/utils'
import { NutritionMetrics } from '~/types'

export function NutritionCard({
	nutrient
}: {
	nutrient: NutritionMetrics[keyof NutritionMetrics]
}) {
	return (
		<Card className='dark:bg-slate-800/50'>
			<CardHeader className='pb-2'>
				<CardTitle className='text-sm font-medium'>Calories</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>
					{round(nutrient.consumed).toLocaleString()} /{' '}
					{nutrient.needed.toLocaleString()}
				</div>
				<p className='text-xs text-gray-500 dark:text-gray-400'>
					{getPercentage(nutrient)}% of daily goal
				</p>
				<div className='mt-4 h-2 overflow-hidden rounded-full dark:bg-primary/20'>
					<div
						className='h-full bg-primary'
						style={{ width: `${getPercentage(nutrient)}%` }}
					></div>
				</div>
			</CardContent>
		</Card>
	)
}
