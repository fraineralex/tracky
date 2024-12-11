'use client'

import { useState } from 'react'
import { DiaryEntry, EntryType } from '~/types/diary'
import { TimelineEntry } from './timeline-entry'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'
import { Button } from '~/components/ui/button'
import { Calendar, Filter } from 'lucide-react'

const initialEntries: DiaryEntry[] = [
	{
		id: '1',
		type: 'food',
		time: '08:00 AM',
		date: 'January 7th, 2024',
		title: 'Breakfast',
		description: 'Oatmeal with berries',
		mealType: 'breakfast',
		nutritionInfo: { calories: 300, protein: 10, fat: 5, carbs: 50 }
	},
	{
		id: '2',
		type: 'exercise',
		time: '09:30 AM',
		date: 'January 7th, 2024',
		title: 'Morning Run',
		description: '5km jog in the park',
		exerciseInfo: {
			caloriesBurned: 400,
			duration: 30,
			category: 'Cardio',
			effortLevel: 'moderate'
		}
	},
	{
		id: '3',
		type: 'food',
		time: '12:30 PM',
		date: 'January 7th, 2024',
		title: 'Lunch',
		description: 'Grilled chicken salad',
		mealType: 'lunch',
		nutritionInfo: { calories: 450, protein: 30, fat: 15, carbs: 20 }
	},
	{
		id: '4',
		type: 'food_registration',
		time: '02:00 PM',
		date: 'January 7th, 2024',
		title: 'New Food Registration',
		description: 'Registered homemade energy bar',
		nutritionInfo: { calories: 200, protein: 5, fat: 10, carbs: 25 }
	},
	{
		id: '5',
		type: 'exercise',
		time: '05:00 PM',
		date: 'January 7th, 2024',
		title: 'Gym Session',
		description: 'Weight training - upper body',
		exerciseInfo: {
			caloriesBurned: 300,
			duration: 60,
			category: 'Strength',
			effortLevel: 'hard'
		}
	},
	{
		id: '6',
		type: 'food',
		time: '07:00 PM',
		date: 'January 7th, 2024',
		title: 'Dinner',
		description: 'Salmon with roasted vegetables',
		mealType: 'dinner',
		nutritionInfo: { calories: 550, protein: 40, fat: 25, carbs: 30 }
	},
	{
		id: '7',
		type: 'food',
		time: '08:30 AM',
		date: 'January 8th, 2024',
		title: 'Breakfast',
		description: 'Scrambled eggs with toast',
		mealType: 'breakfast',
		nutritionInfo: { calories: 350, protein: 20, fat: 15, carbs: 30 }
	}
]

export function DiaryTimeline() {
	const [entries, setEntries] = useState<DiaryEntry[]>(initialEntries)
	const [selectedTypes, setSelectedTypes] = useState<EntryType[]>([
		'food',
		'exercise',
		'food_registration'
	])
	const [selectedDate, setSelectedDate] = useState<string>('all')
	const [selectedMealType, setSelectedMealType] = useState<string>('all')

	const filteredEntries = entries.filter(
		entry =>
			selectedTypes.includes(entry.type) &&
			(selectedDate === 'all' || entry.date === selectedDate) &&
			(selectedMealType === 'all' || entry.mealType === selectedMealType)
	)

	const groupedEntries = filteredEntries.reduce(
		(groups, entry) => {
			if (!groups[entry.date]) {
				groups[entry.date] = []
			}
			groups[entry.date]?.push(entry)
			return groups
		},
		{} as Record<string, DiaryEntry[]>
	)

	const toggleEntryType = (type: EntryType) => {
		setSelectedTypes(prev =>
			prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
		)
	}

	return (
		<div className='space-y-8'>
			<div className='rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800'>
				<h2 className='mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white'>
					<Filter className='mr-2 h-6 w-6' />
					Filters
				</h2>
				<div className='flex flex-wrap gap-6'>
					<div className='flex-grow space-y-2'>
						<h3 className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
							Entry Types
						</h3>
						<div className='flex flex-wrap gap-2'>
							{(['food', 'exercise', 'food_registration'] as const).map(
								type => (
									<Button
										key={type}
										variant={
											selectedTypes.includes(type) ? 'default' : 'outline'
										}
										size='sm'
										onClick={() => toggleEntryType(type)}
										className='capitalize'
									>
										{type.replace('_', ' ')}
									</Button>
								)
							)}
						</div>
					</div>
					<div className='space-y-2'>
						<h3 className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
							Date
						</h3>
						<Select onValueChange={setSelectedDate}>
							<SelectTrigger className='w-[200px]'>
								<Calendar className='mr-2 h-4 w-4' />
								<SelectValue placeholder='Select Date' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Dates</SelectItem>
								{[...new Set(entries.map(e => e.date))].map(date => (
									<SelectItem key={date} value={date}>
										{date}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='space-y-2'>
						<h3 className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
							Meal Type
						</h3>
						<Select onValueChange={setSelectedMealType}>
							<SelectTrigger className='w-[200px]'>
								<SelectValue placeholder='Select Meal Type' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Meal Types</SelectItem>
								<SelectItem value='breakfast'>Breakfast</SelectItem>
								<SelectItem value='lunch'>Lunch</SelectItem>
								<SelectItem value='snack'>Snack</SelectItem>
								<SelectItem value='dinner'>Dinner</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
			{Object.entries(groupedEntries).map(([date, dateEntries]) => (
				<div
					key={date}
					className='overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800'
				>
					<div className='flex items-center px-6 py-4'>
						<div className='h-px flex-grow bg-gray-200 dark:bg-gray-700'></div>
						<h3 className='px-4 text-sm font-normal text-gray-500 dark:text-gray-400'>
							{date}
						</h3>
						<div className='h-px flex-grow bg-gray-200 dark:bg-gray-700'></div>
					</div>
					<div className='divide-y divide-gray-200 dark:divide-gray-700'>
						{dateEntries.map(entry => (
							<TimelineEntry key={entry.id} entry={entry} />
						))}
					</div>
				</div>
			))}
		</div>
	)
}
