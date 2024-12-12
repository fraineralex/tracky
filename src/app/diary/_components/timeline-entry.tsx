import { DiaryEntry } from '~/types/diary'
import {
	Apple,
	Dumbbell,
	BookOpen,
	Clock,
	Utensils,
	Flame,
	Weight,
	Droplet
} from 'lucide-react'
import { format } from 'date-fns'

interface TimelineEntryProps {
	entry: DiaryEntry
}

export function TimelineEntry({ entry }: TimelineEntryProps) {
	const getIcon = () => {
		switch (entry.type) {
			case 'meal':
				return <Utensils className='h-6 w-6 text-green-500' />
			case 'exercise':
				return <Dumbbell className='h-6 w-6 text-blue-500' />
			case 'food':
				return <BookOpen className='h-6 w-6 text-purple-500' />
		}
	}

	return (
		<div className='px-4 py-4 sm:px-6'>
			<div className='flex flex-col items-start justify-between sm:flex-row sm:items-center'>
				<div className='mb-2 flex items-center sm:mb-0'>
					<div className='mr-3 flex-shrink-0'>{getIcon()}</div>
					<div>
						<h4 className='text-lg font-medium text-gray-900 dark:text-white'>
							{entry.title}
						</h4>
						<p className='text-sm capitalize text-gray-600 dark:text-gray-300'>
							{entry.diaryGroup}
						</p>
					</div>
				</div>
				<div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
					<Clock className='mr-1 h-4 w-4' />
					{format(entry.createdAt, 'h:mm a')}
				</div>
			</div>
			{entry.nutritionInfo && (
				<div className='mt-2 flex flex-wrap gap-2'>
					<div className='flex items-center rounded-full bg-red-100 px-2 py-1 dark:bg-primary dark:text-black'>
						<Flame className='mr-1 h-4 w-4 text-red-500' />
						<span className='text-xs font-medium'>
							{entry.nutritionInfo.calories} cal
						</span>
					</div>
					<div className='flex items-center rounded-full bg-blue-100 px-2 py-1 dark:bg-primary dark:text-black'>
						<Weight className='mr-1 h-4 w-4 text-blue-500' />
						<span className='text-xs font-medium'>
							{entry.nutritionInfo.protein}g protein
						</span>
					</div>
					<div className='flex items-center rounded-full bg-yellow-100 px-2 py-1 dark:bg-primary dark:text-black'>
						<Droplet className='mr-1 h-4 w-4 text-yellow-500' />
						<span className='text-xs font-medium'>
							{entry.nutritionInfo.fat}g fat
						</span>
					</div>
					<div className='flex items-center rounded-full bg-green-100 px-2 py-1 dark:bg-primary dark:text-black'>
						<Apple className='mr-1 h-4 w-4 text-green-500' />
						<span className='text-xs font-medium'>
							{entry.nutritionInfo.carbs}g carbs
						</span>
					</div>
				</div>
			)}
			{entry.exerciseInfo && (
				<div className='mt-2 flex flex-wrap gap-2'>
					<div className='flex items-center rounded-full bg-red-100 px-2 py-1 dark:bg-primary dark:text-black'>
						<Flame className='mr-1 h-4 w-4 text-red-500' />
						<span className='text-xs font-medium'>
							{entry.exerciseInfo.burned} cal burned
						</span>
					</div>
					<div className='flex items-center rounded-full bg-blue-100 px-2 py-1 dark:bg-primary dark:text-black'>
						<Clock className='mr-1 h-4 w-4 text-blue-500' />
						<span className='text-xs font-medium'>
							{entry.exerciseInfo.duration} min
						</span>
					</div>
					<div className='flex items-center rounded-full bg-purple-100 px-2 py-1 dark:bg-primary dark:text-black'>
						<Dumbbell className='mr-1 h-4 w-4 text-purple-500' />
						<span className='text-xs font-medium'>
							{entry.exerciseInfo.name}
						</span>
					</div>
					<div className='flex items-center rounded-full bg-green-100 px-2 py-1 dark:bg-primary dark:text-black'>
						<Weight className='mr-1 h-4 w-4 text-green-500' />
						<span className='text-xs font-medium'>
							Effort:{' '}
							<span className='ms-1 capitalize'>
								{entry.exerciseInfo.effort.includes('-')
									? entry.exerciseInfo.effort.replace('-', ' ')
									: entry.exerciseInfo.effort}
							</span>
						</span>
					</div>
				</div>
			)}
		</div>
	)
}
