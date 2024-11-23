import { CakeSlice, EggFried, Flame, Ham } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { calculatePercentage, round } from '~/lib/calculations'
import { NutritionMetrics } from '~/types'

export function NutritionCard({
	nutrient,
	name
}: {
	nutrient: NutritionMetrics[keyof NutritionMetrics]
	name: string
}) {
	const nutritionIcons: { [nutrient: string]: typeof Flame } = {
		calories: Flame,
		protein: Ham,
		fats: EggFried,
		carbs: CakeSlice
	}

	const Icon = nutritionIcons[name] as typeof Flame

	return (
		<Card className='transition-shadow hover:shadow-lg dark:bg-slate-800/50'>
			<CardHeader className='flex flex-row items-center justify-between pb-2'>
				<CardTitle className='text-sm font-medium capitalize'>{name}</CardTitle>
				<Icon className='h-4 w-4 text-muted-foreground' />
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>
					{round(nutrient.consumed).toLocaleString()} /{' '}
					{nutrient.needed.toLocaleString()}
				</div>
				<p className='text-xs text-gray-500 dark:text-gray-400'>
					{calculatePercentage(nutrient)}% of daily goal
				</p>
				<div className='mt-4 h-2 overflow-hidden rounded-full dark:bg-primary/20'>
					<div
						className='h-full bg-primary'
						style={{ width: `${calculatePercentage(nutrient)}%` }}
					></div>
				</div>
			</CardContent>
		</Card>
	)
}
