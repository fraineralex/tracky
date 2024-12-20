'use client'

import { DiaryEntry, EntryType } from '~/types/diary'
import { TimelineEntry } from './timeline-entry'
import { format } from 'date-fns'
import { Header } from './header'
import { DailyUserStats } from '~/types'
import { DailySummary } from './daily-summary'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export function DiaryTimeline({
	diaryEntries,
	userDailyResume
}: {
	diaryEntries: DiaryEntry[]
	userDailyResume: { [key: string]: DailyUserStats }
}) {
	const searchParams = useSearchParams()
	const [selectedDate, setSelectedDate] = React.useState<string>('all')
	const [selectedDiaryGroup, setSelectedDiaryGroup] =
		React.useState<string>('all')
	const [selectedEntries, setSelectedEntries] = React.useState<EntryType[]>(
		(searchParams.get('entries')?.split(',') as EntryType[]) || [
			'meal',
			'exercise',
			'food',
			'updates'
		]
	)

	const updateEntries = ['weight', 'goal', 'activity', 'fat', 'height']
	const filteredEntries = diaryEntries.filter(
		entry =>
			(selectedEntries.includes(entry.type) ||
				(selectedEntries.includes('updates') &&
					updateEntries.includes(entry.type))) &&
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
				selectedTypes={selectedEntries}
				setSelectedDate={setSelectedDate}
				setSelectedDiaryGroup={setSelectedDiaryGroup}
				setSelectedTypes={setSelectedEntries}
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
					{userDailyResume[date] &&
						(selectedEntries.includes('meal') ||
							selectedEntries.includes('exercise')) && (
							<div className='pt-2'>
								<DailySummary
									daySummary={userDailyResume[date]}
									filter={selectedEntries}
								/>
							</div>
						)}
				</div>
			))}
			{diaryEntries.length > 0 && filteredEntries.length === 0 && (
				<div className='pt-10 text-center text-foreground'>
					No entries found for the selected filters
				</div>
			)}
			{diaryEntries.length === 0 && (
				<div className='pt-10 text-center text-foreground'>
					There are no entries to display yet
				</div>
			)}
		</div>
	)
}
