'use client'

import { Calendar, Filter } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'
import { EntryType } from '~/types/diary'

export function Header({
	availableDates,
	selectedTypes,
	setSelectedTypes,
	setSelectedDate,
	setSelectedDiaryGroup
}: {
	availableDates: string[]
	selectedTypes: EntryType[]
	setSelectedTypes: (entryType: EntryType[]) => void
	setSelectedDate: (date: string) => void
	setSelectedDiaryGroup: (diaryGroup: string) => void
}) {
	const toggleEntryType = (type: EntryType) => {
		const newTypes = selectedTypes.includes(type)
			? selectedTypes.filter(t => t !== type)
			: [...selectedTypes, type]
		setSelectedTypes(newTypes)
	}

	return (
		<header className='rounded-lg border border-muted-foreground/20 p-6 shadow-lg'>
			<h2 className='mb-6 flex items-center text-2xl font-semibold'>
				<Filter className='mr-2 h-6 w-6' />
				Filters
			</h2>
			<div className='flex flex-wrap gap-6'>
				<div className='flex-grow space-y-2'>
					<h3 className='mb-2 text-sm font-medium'>Entry Types</h3>
					<div className='flex gap-2 md:flex-wrap'>
						{(['meal', 'exercise', 'food', 'updates'] as const).map(type => (
							<Button
								key={type}
								variant={selectedTypes.includes(type) ? 'default' : 'outline'}
								size='sm'
								onClick={() => toggleEntryType(type)}
								className='capitalize'
							>
								{type.replace('_', ' ')}
							</Button>
						))}
					</div>
				</div>
				<div className='space-y-2'>
					<h3 className='mb-2 text-sm font-medium'>Date</h3>
					<Select onValueChange={setSelectedDate}>
						<SelectTrigger className='w-[200px]'>
							<Calendar className='mr-2 h-4 w-4' />
							<SelectValue placeholder='Select Date' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Dates</SelectItem>
							{availableDates.map(date => (
								<SelectItem key={date} value={date}>
									{date}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='space-y-2'>
					<h3 className='mb-2 text-sm font-medium'>Diary Group</h3>
					<Select onValueChange={setSelectedDiaryGroup}>
						<SelectTrigger className='w-[200px]'>
							<SelectValue placeholder='Select Diary Group' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Diary Groups</SelectItem>
							<SelectItem value='breakfast'>Breakfast</SelectItem>
							<SelectItem value='lunch'>Lunch</SelectItem>
							<SelectItem value='snack'>Snack</SelectItem>
							<SelectItem value='dinner'>Dinner</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</header>
	)
}
