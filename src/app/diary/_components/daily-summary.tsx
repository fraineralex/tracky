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

export function DailySummary({
	daySummary,
	filter
}: {
	daySummary: DailyUserStats
	filter: EntryType[]
}) {
	const summaryItems = [
		{
			label: 'Cal',
			icon: Flame,
			value: `${daySummary.calories.consumed.toLocaleString()}/${daySummary.calories.needed.toLocaleString()}`,
			unit: 'kcal',
			color: 'bg-accent text-accent-foreground',
			category: 'meal'
		},
		{
			label: 'Protein',
			icon: Drumstick,
			value: `${daySummary.protein.consumed.toLocaleString()}/${daySummary.protein.needed.toLocaleString()}`,
			unit: 'g',
			color: 'bg-accent text-accent-foreground',
			category: 'meal'
		},
		{
			label: 'Carbs',
			icon: Wheat,
			value: `${daySummary.carbs.consumed.toLocaleString()}/${daySummary.carbs.needed.toLocaleString()}`,
			unit: 'g',
			color: 'bg-accent text-accent-foreground',
			category: 'meal'
		},
		{
			label: 'Fat',
			icon: Nut,
			value: `${daySummary.fats.consumed.toLocaleString()}/${daySummary.fats.needed.toLocaleString()}`,
			unit: 'g',
			color: 'bg-accent text-accent-foreground',
			category: 'meal'
		},
		{
			label: 'Expenditure',
			icon: FlameKindling,
			value: `${daySummary.exercise.burned.toLocaleString()}/${daySummary.exercise.needed.toLocaleString()}`,
			unit: 'kcal',
			color: 'bg-accent text-accent-foreground',
			category: 'exercise'
		},
		{
			label: 'Total Duration',
			icon: Clock,
			value: `${daySummary.exercise.duration}`,
			unit: 'min',
			color: 'bg-accent text-accent-foreground',
			category: 'exercise'
		}
	]

	return (
		<div className='px-4 pb-6 shadow-lg'>
			<div className='flex items-center px-6 pb-4'>
				<span className='h-px flex-grow bg-gray-500/50' />
				<h3 className='mb-3 px-4 text-lg font-medium'>Day Summary</h3>
				<span className='h-px flex-grow bg-gray-500/50' />
			</div>
			<div className={`flex flex-wrap justify-center gap-2`}>
				{summaryItems
					.filter(item => filter.includes(item.category as EntryType))
					.map(item => (
						<div
							key={item.label}
							className={`flex items-center space-x-2 rounded-full px-2 py-1 text-xs ${item.color}`}
						>
							<div className='flex items-center space-x-1'>
								<item.icon className='h-4 w-4' />
								<span>{item.label}:</span>
							</div>
							<span>
								{item.value}
								{item.unit}
							</span>
						</div>
					))}
			</div>
		</div>
	)
}
