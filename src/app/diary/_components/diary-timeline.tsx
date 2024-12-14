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
import { format } from 'date-fns'

export function DiaryTimeline({
	diaryEntries
}: {
	diaryEntries: DiaryEntry[]
}) {
	const [selectedTypes, setSelectedTypes] = useState<EntryType[]>([
		'meal',
		'exercise',
		'food'
	])
	const [selectedDate, setSelectedDate] = useState<string>('all')
	const [selectedDiaryGroup, setSelectedDiaryGroup] = useState<string>('all')

	const filteredEntries = diaryEntries.filter(
		entry =>
			selectedTypes.includes(entry.type) &&
			(selectedDate === 'all' ||
				format(entry.createdAt, 'MMMM do, yyyy') === selectedDate) &&
			(selectedDiaryGroup === 'all' || entry.diaryGroup === selectedDiaryGroup)
	)

	const groupedEntries = filteredEntries.reduce(
		(groups, entry) => {
			const date = format(entry.createdAt, 'MMMM do, yyyy')
			if (!groups[date]) {
				groups[date] = []
			}
			groups[date]?.push(entry)
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
			<div className='rounded-lg border border-muted-foreground/20 p-6 shadow-lg'>
				<h2 className='mb-6 flex items-center text-2xl font-semibold'>
					<Filter className='mr-2 h-6 w-6' />
					Filters
				</h2>
				<div className='flex flex-wrap gap-6'>
					<div className='flex-grow space-y-2'>
						<h3 className='mb-2 text-sm font-medium'>Entry Types</h3>
						<div className='flex flex-wrap gap-2'>
							{(['meal', 'exercise', 'food'] as const).map(type => (
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
								{[
									...new Set(
										diaryEntries.map(e => format(e.createdAt, 'MMMM do, yyyy'))
									)
								].map(date => (
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
			</div>
			{Object.entries(groupedEntries).map(([date, dateEntries]) => (
				<div key={date} className='overflow-hidden rounded-lg shadow-md'>
					<div className='flex items-center px-6 py-4'>
						<div className='h-px flex-grow bg-foreground'></div>
						<h3 className='px-4 text-sm font-normal text-foreground'>{date}</h3>
						<div className='h-px flex-grow bg-foreground'></div>
					</div>
					<div className='divide-y'>
						{dateEntries.map((entry, index) => (
							<TimelineEntry key={index} entry={entry} />
						))}
					</div>
				</div>
			))}
		</div>
	)
}
