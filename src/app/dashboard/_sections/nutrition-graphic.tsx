'use client'

import { Flame } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/ui/button'
import { round } from '~/lib/utils'
import { NutritionMetrics, NutritionMetricsPerDay } from '~/types'

export default function NutritionGraphic({
	nutritionMetrics: nutrition
}: {
	nutritionMetrics: NutritionMetricsPerDay
}) {
	console.log(nutrition)
	const [showConsumed, setShowConsumed] = React.useState(true)

	const dayOfWeek = new Date().getDay()
	const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
	const colors = ['#60a5fa', '#fb923c', '#facc15', '#4ade80']
	const todayNutrition = nutrition[dayOfWeek]

	function getNutrientPercentage(index: number, day: number) {
		if (!nutrition[day]) return 0
		const nutrient = Object.values(nutrition[day])[
			index
		] as NutritionMetrics[keyof NutritionMetrics]
		return (
			((showConsumed ? nutrient.consumed : nutrient.remaining) /
				nutrient.needed) *
			100
		)
	}

	let calories = todayNutrition?.calories.consumed
	let protein = todayNutrition?.protein.consumed
	let fats = todayNutrition?.fats.consumed
	let carbs = todayNutrition?.carbs.consumed

	if (!showConsumed) {
		calories =
			(todayNutrition?.calories.remaining ?? 0) > 0
				? todayNutrition?.calories.remaining
				: 0
		protein =
			(todayNutrition?.protein.remaining ?? 0) > 0
				? todayNutrition?.protein.remaining
				: 0
		fats =
			(todayNutrition?.fats.remaining ?? 0) > 0
				? todayNutrition?.fats.remaining
				: 0
		carbs =
			(todayNutrition?.carbs.remaining ?? 0) > 0
				? todayNutrition?.carbs.remaining
				: 0
	}
	return (
		<article className='h-fit w-full max-w-[490px] rounded-lg border bg-slate-200 p-5 dark:bg-slate-800/50'>
			<h2 className='mb-3'>Nutrition & Targets</h2>
			<div className='mb-2 grid grid-cols-10 space-x-5'>
				<div className='col-span-8 grid grid-flow-row space-y-2'>
					{[...Array(4)].map((_, nutrientIndex) => (
						<div className='flex space-x-5 border-b pb-2' key={nutrientIndex}>
							{[...Array(7)].map((_, dayIndex) => (
								<span
									className={`rounded-md px-4 py-4 ${dayIndex === dayOfWeek - 1 ? 'border-2 border-primary' : ''}`}
									key={dayIndex}
									style={{
										background: `linear-gradient(to top, ${colors[nutrientIndex]} ${getNutrientPercentage(nutrientIndex, dayIndex + 1)}%, hsl(var(--primary) / 0.2) ${getNutrientPercentage(nutrientIndex, dayIndex + 1)}%)`
									}}
								></span>
							))}
						</div>
					))}
				</div>
				<aside className='col-span-2 flex flex-col place-content-center justify-between'>
					<p className='font-bold leading-tight'>
						{round(calories)}
						<Flame className='inline h-6 w-6 pb-1' />
						<small className='block text-sm font-normal text-gray-500 dark:text-gray-400'>
							of {todayNutrition?.calories?.needed}
						</small>
					</p>
					<p className='font-bold leading-tight'>
						{round(protein)} P
						<small className='block text-sm font-normal text-gray-500 dark:text-gray-400'>
							of {todayNutrition?.protein.needed}
						</small>
					</p>
					<p className='font-bold leading-tight'>
						{round(fats)} F
						<small className='block text-sm font-normal text-gray-500 dark:text-gray-400'>
							of {todayNutrition?.fats.needed}
						</small>
					</p>
					<p className='font-bold leading-tight'>
						{round(carbs)} C
						<small className='block text-sm font-normal text-gray-500 dark:text-gray-400'>
							of {todayNutrition?.carbs.needed}
						</small>
					</p>
				</aside>
			</div>
			<div className='mt-4 flex space-x-4'>
				{days.map((day, index) => (
					<span
						className={`px-3 py-2 ${index === dayOfWeek - 1 ? 'rounded-md border-2 border-primary font-bold' : ''}`}
						key={index}
					>
						{day}
					</span>
				))}
			</div>
			<footer className='mt-4 flex place-content-center space-x-3'>
				<Button
					variant={showConsumed ? 'default' : 'ghost'}
					className='rounded-full'
					onClick={() => setShowConsumed(true)}
				>
					Consumed
				</Button>
				<Button
					variant={!showConsumed ? 'default' : 'ghost'}
					className='rounded-full'
					onClick={() => setShowConsumed(false)}
				>
					Remainig
				</Button>
			</footer>
		</article>
	)
}
