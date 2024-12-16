'use client'

import { useState } from 'react'
import { DiaryEntry, EntryType } from '~/types/diary'
import { TimelineEntry } from './timeline-entry'
import { format } from 'date-fns'
import { Header } from './header'

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

	const availableDates = [
		...new Set(diaryEntries.map(e => format(e.createdAt, 'MMMM do, yyyy')))
	]

	return (
		<div className='space-y-8'>
			<Header
				availableDates={availableDates}
				selectedTypes={selectedTypes}
				setSelectedDate={setSelectedDate}
				setSelectedDiaryGroup={setSelectedDiaryGroup}
				setSelectedTypes={setSelectedTypes}
			/>
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
