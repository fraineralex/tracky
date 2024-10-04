import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { getPercentage, round } from '~/lib/utils'
import { NutritionMetrics } from '~/types'

export function NutritionCards({ nutrition }: { nutrition: NutritionMetrics }) {
	const { calories, protein, fats, carbs } = nutrition

	return (
		<div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-sm font-medium'>Calories</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>
						{round(calories.consumed).toLocaleString()} /{' '}
						{calories.needed.toLocaleString()}
					</div>
					<p className='text-xs text-muted-foreground'>
						{getPercentage(calories)}% of daily goal
					</p>
					<div className='mt-4 h-2 overflow-hidden rounded-full bg-secondary'>
						<div
							className='h-full bg-primary'
							style={{ width: getPercentage(calories) }}
						></div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-sm font-medium'>Protein</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>
						{round(protein.consumed).toLocaleString()}g /{' '}
						{protein.needed.toLocaleString()}g
					</div>
					<p className='text-xs text-muted-foreground'>
						{getPercentage(protein)}% of daily goal
					</p>
					<div className='mt-4 h-2 overflow-hidden rounded-full bg-secondary'>
						<div
							className='h-full bg-primary'
							style={{ width: `${getPercentage(protein)}%` }}
						></div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-sm font-medium'>Fat</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>
						{round(fats.consumed).toLocaleString()}g / {fats.needed.toLocaleString()}g
					</div>
					<p className='text-xs text-muted-foreground'>
						{getPercentage(fats)}% of daily goal
					</p>
					<div className='mt-4 h-2 overflow-hidden rounded-full bg-secondary'>
						<div
							className='h-full bg-primary'
							style={{ width: getPercentage(fats) }}
						></div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-sm font-medium'>Carbs</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>
						{round(carbs.consumed).toLocaleString()}g / {carbs.needed.toLocaleString()}
						g
					</div>
					<p className='text-xs text-muted-foreground'>
						{getPercentage(carbs)}% of daily goal
					</p>
					<div className='mt-4 h-2 overflow-hidden rounded-full bg-secondary'>
						<div
							className='h-full bg-primary'
							style={{ width: getPercentage(carbs) }}
						></div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
