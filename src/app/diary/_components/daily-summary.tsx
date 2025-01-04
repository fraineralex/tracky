import React from 'react'
import {
	Flame,
	Clock,
	Wheat,
	FlameKindling,
	Drumstick,
	Nut
} from 'lucide-react'
import { DailyUserStats } from '~/types'
import { EntryType } from '~/types/diary'
import { formatNumber } from '~/lib/utils'

export function DailySummary({
	daySummary,
	filter
}: {
	daySummary: DailyUserStats
	filter: EntryType[]
}) {
	const summaryItems = [
		{
			label: 'Burned',
			icon: FlameKindling,
			value: `${formatNumber(daySummary.exercise.burned)}/${formatNumber(daySummary.exercise.needed)}`,
			unit: 'kcal',
			color: 'bg-accent text-accent-foreground',
			category: 'exercise',
			show: daySummary.exercise.burned > 0
		},
		{
			label: 'Cal',
			icon: Flame,
			value: `${formatNumber(daySummary.calories.consumed)}/${formatNumber(daySummary.calories.needed)}`,
			unit: 'kcal',
			color: 'bg-accent text-accent-foreground',
			category: 'meal',
			show: daySummary.calories.consumed > 0
		},
		{
			label: 'Protein',
			icon: Drumstick,
			value: `${formatNumber(daySummary.protein.consumed)}/${formatNumber(daySummary.protein.needed)}`,
			unit: 'g',
			color: 'bg-accent text-accent-foreground',
			category: 'meal',
			show: daySummary.protein.consumed > 0
		},
		{
			label: 'Carbs',
			icon: Wheat,
			value: `${formatNumber(daySummary.carbs.consumed)}/${formatNumber(daySummary.carbs.needed)}`,
			unit: 'g',
			color: 'bg-accent text-accent-foreground',
			category: 'meal',
			show: daySummary.carbs.consumed > 0
		},
		{
			label: 'Fat',
			icon: Nut,
			value: `${formatNumber(daySummary.fats.consumed)}/${formatNumber(daySummary.fats.needed)}`,
			unit: 'g',
			color: 'bg-accent text-accent-foreground',
			category: 'meal',
			show: daySummary.fats.consumed > 0
		},
		{
			label: 'Duration',
			icon: Clock,
			value: `${formatNumber(daySummary.exercise.duration)}`,
			unit: 'min',
			color: 'bg-accent text-accent-foreground',
			category: 'exercise',
			show: daySummary.exercise.duration > 0
		}
	]

	return (
		<div className='pb-6 shadow-lg'>
			<div className='flex items-center px-6 pb-4'>
				<span className='h-px flex-grow bg-gray-500/50' />
				<h3 className='mb-3 px-4 text-lg font-medium'>Day Summary</h3>
				<span className='h-px flex-grow bg-gray-500/50' />
			</div>
			<div className={`flex flex-wrap justify-center gap-2`}>
				{summaryItems
					.filter(
						item => filter.includes(item.category as EntryType) && item.show
					)
					.map(item => (
						<div
							key={item.label}
							className={`flex items-center space-x-2 rounded-full px-2 py-1 text-xs ${item.color}`}
						>
							<div className='flex items-center space-x-1'>
								<item.icon className='h-4 w-4' />
								<span className='text-xs'>{item.label}:</span>
							</div>
							<span className='text-xs'>
								{item.value} {item.unit}
							</span>
						</div>
					))}
			</div>
		</div>
	)
}
