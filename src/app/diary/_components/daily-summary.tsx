import React from 'react'
import {
	Flame,
	Beef,
	CroissantIcon as Bread,
	BeanIcon as Avocado,
	Dumbbell,
	Clock
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
			color: 'bg-primary text-primary-foreground',
			category: 'meal'
		},
		{
			label: 'Protein',
			icon: Beef,
			value: `${daySummary.protein.consumed.toLocaleString()}/${daySummary.protein.needed.toLocaleString()}`,
			unit: 'g',
			color: 'bg-primary text-primary-foreground',
			category: 'meal'
		},
		{
			label: 'Carbs',
			icon: Bread,
			value: `${daySummary.carbs.consumed.toLocaleString()}/${daySummary.carbs.needed.toLocaleString()}`,
			unit: 'g',
			color: 'bg-primary text-primary-foreground',
			category: 'meal'
		},
		{
			label: 'Fat',
			icon: Avocado,
			value: `${daySummary.fats.consumed.toLocaleString()}/${daySummary.fats.needed.toLocaleString()}`,
			unit: 'g',
			color: 'bg-primary text-primary-foreground',
			category: 'meal'
		},
		{
			label: 'Cal burned',
			icon: Dumbbell,
			value: `${daySummary.exercise.burned.toLocaleString()}/${daySummary.exercise.needed.toLocaleString()}`,
			unit: 'kcal',
			color: 'bg-primary text-primary-foreground',
			category: 'exercise'
		},
		{
			label: 'Exercise',
			icon: Clock,
			value: `${daySummary.exercise.duration}`,
			unit: 'min',
			color: 'bg-primary text-primary-foreground',
			category: 'exercise'
		}
	]

	const filterCategories = new Set(filter)
	const hasCategory = (category: EntryType) => filterCategories.has(category)

	const gridColsConfig = {
		meal: hasCategory('meal') && filter.length === 1 ? 'md:grid-cols-4' : '',
		exercise:
			hasCategory('exercise') && filter.length === 1 ? 'md:grid-cols-2' : '',
		both: hasCategory('meal') && hasCategory('exercise') ? 'md:grid-cols-3' : ''
	}

	return (
		<div className='px-4 pb-6 shadow-lg'>
			<div className='flex items-center px-6 pb-4'>
				<span className='h-px flex-grow bg-gray-500/50' />
				<h3 className='mb-3 px-4 text-lg font-medium'>Day Summary</h3>
				<span className='h-px flex-grow bg-gray-500/50' />
			</div>
			<div
				className={`grid grid-cols-1 gap-2 sm:grid-cols-2 ${gridColsConfig.meal} ${gridColsConfig.exercise} ${gridColsConfig.both}`}
			>
				{summaryItems
					.filter(item => filter.includes(item.category as EntryType))
					.map(item => (
						<div key={item.label} className='flex-1'>
							<div
								className={`flex items-center justify-between space-x-1 rounded-full px-2 py-1.5 text-sm font-normal ${item.color}`}
							>
								<div className='flex items-center space-x-1'>
									<item.icon className='h-4 w-4' />
									<span>{item.label}</span>
								</div>
								<span>
									{item.value}
									{item.unit}
								</span>
							</div>
						</div>
					))}
			</div>
		</div>
	)
}
