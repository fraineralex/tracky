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

interface TimelineEntryProps {
	entry: DiaryEntry
}

export function TimelineEntry({ entry }: TimelineEntryProps) {
	const getIcon = () => {
		switch (entry.type) {
			case 'food':
				return <Utensils className='h-6 w-6 text-green-500' />
			case 'exercise':
				return <Dumbbell className='h-6 w-6 text-blue-500' />
			case 'food_registration':
				return <BookOpen className='h-6 w-6 text-purple-500' />
		}
	}

	return (
		<div className='flex items-center space-x-4 px-6 py-4'>
			<div className='flex-shrink-0'>{getIcon()}</div>
			<div className='flex-grow'>
				<div className='flex items-center justify-between'>
					<h4 className='text-lg font-medium text-gray-900 dark:text-white'>
						{entry.title}
					</h4>
					<div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
						<Clock className='mr-1 h-4 w-4' />
						{entry.time}
					</div>
				</div>
				<p className='mt-1 text-sm text-gray-600 dark:text-gray-300'>
					{entry.description}
				</p>
				{entry.mealType && (
					<p className='mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400'>
						<Apple className='mr-1 h-4 w-4' />
						Meal: {entry.mealType}
					</p>
				)}
			</div>
			{entry.nutritionInfo && (
				<div className='flex flex-shrink-0 items-center space-x-4'>
					<div className='flex items-center'>
						<Flame className='mr-1 h-5 w-5 text-red-500' />
						<span className='text-sm font-medium'>
							{entry.nutritionInfo.calories} cal
						</span>
					</div>
					<div className='flex items-center'>
						<Weight className='mr-1 h-5 w-5 text-blue-500' />
						<span className='text-sm font-medium'>
							{entry.nutritionInfo.protein}g protein
						</span>
					</div>
					<div className='flex items-center'>
						<Droplet className='mr-1 h-5 w-5 text-yellow-500' />
						<span className='text-sm font-medium'>
							{entry.nutritionInfo.fat}g fat
						</span>
					</div>
					<div className='flex items-center'>
						<Apple className='mr-1 h-5 w-5 text-green-500' />
						<span className='text-sm font-medium'>
							{entry.nutritionInfo.carbs}g carbs
						</span>
					</div>
				</div>
			)}
			{entry.exerciseInfo && (
				<div className='flex flex-shrink-0 items-center space-x-4'>
					<div className='flex items-center'>
						<Flame className='mr-1 h-5 w-5 text-red-500' />
						<span className='text-sm font-medium'>
							{entry.exerciseInfo.caloriesBurned} cal burned
						</span>
					</div>
					<div className='flex items-center'>
						<Clock className='mr-1 h-5 w-5 text-blue-500' />
						<span className='text-sm font-medium'>
							{entry.exerciseInfo.duration} min
						</span>
					</div>
					<div className='flex items-center'>
						<Dumbbell className='mr-1 h-5 w-5 text-purple-500' />
						<span className='text-sm font-medium'>
							{entry.exerciseInfo.category}
						</span>
					</div>
					<div className='flex items-center'>
						<Weight className='mr-1 h-5 w-5 text-green-500' />
						<span className='text-sm font-medium'>
							Effort: {entry.exerciseInfo.effortLevel}
						</span>
					</div>
				</div>
			)}
		</div>
	)
}
