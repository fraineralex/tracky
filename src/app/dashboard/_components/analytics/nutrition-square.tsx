'use client'

import { Drumstick, Flame, Nut, Wheat } from 'lucide-react'
import React from 'react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '~/components/ui/tooltip'
import { round } from '~/lib/calculations'
import { NutritionMetrics } from '~/types'

export function NutritionSquare({
	dayIndex,
	nutrientIndex,
	dayOfWeek,
	percentage,
	days,
	nutrient,
	nutritionDay
}: {
	dayIndex: number
	nutrientIndex: number
	dayOfWeek: number
	percentage: string
	days: string[]
	nutrient?: NutritionMetrics[keyof NutritionMetrics]
	nutritionDay?: NutritionMetrics
}) {
	const [open, setOpen] = React.useState(false)

	const daysText = [
		'Mondey',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday'
	]
	const nutrientNames = ['Calories', 'Protein', 'Fats', 'Carbs']
	const nutrientIcons = [
		<Flame key='flame' className='h-4 w-4' />,
		<Drumstick key='drumstick' className='h-4 w-4' />,
		<Nut key='nut' className='h-4 w-4' />,
		<Wheat key='wheat' className='h-4 w-4' />
	]
	const colors = [
		'text-red-300 dark:text-red-500',
		'text-blue-300 dark:text-blue-500',
		'text-yellow-300 dark:text-yellow-500',
		'text-green-300 dark:text-green-500'
	]

	return (
		<TooltipProvider delayDuration={100}>
			<Tooltip open={open} onOpenChange={open => setOpen(open)}>
				<TooltipTrigger asChild>
					{dayIndex < 7 && nutrientIndex < 4 ? (
						<span
							className='pointer rounded-md px-4 py-4'
							key={dayIndex}
							style={{
								background: `linear-gradient(to top, hsl(var(--foreground) / ${dayIndex === dayOfWeek ? '0.9' : '0.5'}) ${percentage}%, hsl(var(--primary) / 0.2) ${percentage}%)`
							}}
							onClick={() => setOpen(!open)}
						></span>
					) : (
						<span
							className={`-ms-1 px-3 py-2 ${dayIndex === dayOfWeek ? 'rounded-md border-2 border-primary font-semibold' : ''}`}
							key={dayIndex}
							onClick={() => setOpen(!open)}
						>
							{days[dayIndex]}
						</span>
					)}
				</TooltipTrigger>
				<TooltipContent className='flex flex-col gap-1'>
					{dayIndex < 7 && nutrientIndex < 4 ? (
						<>
							<p
								className={`font-semibold ${colors[nutrientIndex]} flex space-x-1`}
							>
								{nutrientIcons[nutrientIndex]}
								<span>
									{nutrientNames[nutrientIndex]} {percentage}%
								</span>
							</p>
							<p className='flex space-x-1 text-gray-300 dark:text-gray-700'>
								<strong>Consumed:</strong>
								<span>
									{round(nutrient?.consumed).toLocaleString()} /{' '}
									{round(nutrient?.needed).toLocaleString()}{' '}
									{nutrientIndex === 0 ? 'kcal' : 'g'}
								</span>
							</p>
							<p className='flex space-x-1 text-gray-300 dark:text-gray-700'>
								<strong>Remainig:</strong>
								<span>
									{(nutrient?.needed ?? 0) > (nutrient?.consumed ?? 0)
										? round(
												(nutrient?.needed ?? 0) - (nutrient?.consumed ?? 0)
											).toLocaleString()
										: 0}{' '}
									{nutrientIndex === 0 ? 'kcal' : 'g'}
								</span>
							</p>
						</>
					) : (
						<article className='text-gray-300 dark:text-gray-700'>
							<p
								className={`font-semibold text-indigo-300 dark:text-indigo-500`}
							>
								{daysText[dayIndex]} {percentage}%
							</p>
							<p className='flex items-center space-x-1'>
								<Flame className='h-4 w-4 text-red-300 dark:text-red-500' />
								<strong>Calories:</strong>{' '}
								<span>
									{round(nutritionDay?.calories.consumed).toLocaleString()} /{' '}
									{round(nutritionDay?.calories.needed).toLocaleString()} kcal
								</span>
							</p>
							<p className='flex items-center space-x-1'>
								<Drumstick className='h-4 w-4 text-blue-300 dark:text-blue-500' />
								<strong>Protein:</strong>{' '}
								<span>
									{round(nutritionDay?.protein.consumed).toLocaleString()} /{' '}
									{round(nutritionDay?.protein.needed).toLocaleString()} g
								</span>
							</p>
							<p className='flex items-center space-x-1'>
								<Nut className='h-4 w-4 text-yellow-300 dark:text-yellow-500' />
								<strong>Fats:</strong>{' '}
								<span>
									{round(nutritionDay?.fats.consumed).toLocaleString()} /{' '}
									{round(nutritionDay?.fats.needed).toLocaleString()} g
								</span>
							</p>
							<p className='flex items-center space-x-1'>
								<Wheat className='h-4 w-4 text-green-300 dark:text-green-500' />
								<strong>Carbs:</strong>{' '}
								<span>
									{round(nutritionDay?.carbs.consumed).toLocaleString()} /{' '}
									{round(nutritionDay?.carbs.needed).toLocaleString()} g
								</span>
							</p>
						</article>
					)}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
