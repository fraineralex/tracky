'use client'

import { Flame } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/ui/button'
import { round, getAdjustedDay } from '~/lib/utils'
import { NutritionMetrics, NutritionMetricsPerDay } from '~/types'

export default function NutritionGraphic({
	nutritionMetrics: nutrition
}: {
	nutritionMetrics: NutritionMetricsPerDay
}) {
	const [showConsumed, setShowConsumed] = React.useState(true)

	const dayOfWeek = getAdjustedDay(new Date())
	const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
	const colors = ['#60a5fa', '#fb923c', '#facc15', '#4ade80']
	const { calories, protein, fats, carbs } = nutrition[
		dayOfWeek as keyof NutritionMetricsPerDay
	] as NutritionMetrics

	function getNutrientPercentage(index: number, day: number) {
		if (!nutrition[day]) return 0
		const nutrient = Object.values(nutrition[day])[
			index
		] as NutritionMetrics[keyof NutritionMetrics]
		return (
			((showConsumed
				? nutrient.consumed
				: nutrient.needed - nutrient.consumed) /
				nutrient.needed) *
			100
		)
	}

	let tdayCalories = calories.consumed
	let tdayProtein = protein.consumed
	let tdayFats = fats.consumed
	let tdayCarbs = carbs.consumed

	if (!showConsumed) {
		tdayCalories = Math.max(calories.needed, calories.consumed, 0)
		tdayProtein = Math.max(protein.needed, protein.consumed, 0)
		tdayFats = Math.max(fats.needed, fats.consumed, 0)
		tdayCarbs = Math.max(carbs.needed, carbs.consumed, 0)
	}

	return (
		<article className='mx-auto h-fit w-full rounded-lg border bg-slate-200 p-5 pr-1 dark:bg-slate-800/50 md:mx-0 lg:max-w-96 xl:max-w-[490px]'>
			<h2 className='mb-3'>Nutrition & Targets</h2>
			<div className='mb-2 grid grid-cols-10 space-x-5 lg:space-x-3 xl:space-x-5'>
				<div className='col-span-8 grid grid-flow-row space-y-2'>
					{[...Array(4)].map((_, nutrientIndex) => (
						<div
							className='flex space-x-5 border-b pb-2 lg:space-x-2 xl:space-x-5'
							key={nutrientIndex}
						>
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
				<aside className='col-span-2 flex flex-col place-content-center justify-between text-sm'>
					<p className='font-bold leading-tight'>
						{round(tdayCalories).toLocaleString()}
						<Flame className='inline h-6 w-6 pb-1' />
						<small className='block text-sm font-normal text-gray-500 dark:text-gray-400'>
							of {calories.needed.toLocaleString()}
						</small>
					</p>
					<p className='font-bold leading-tight'>
						{round(tdayProtein).toLocaleString()} P
						<small className='block text-sm font-normal text-gray-500 dark:text-gray-400'>
							of {protein.needed.toLocaleString()}
						</small>
					</p>
					<p className='font-bold leading-tight'>
						{round(tdayFats).toLocaleString()} F
						<small className='block text-sm font-normal text-gray-500 dark:text-gray-400'>
							of {fats.needed.toLocaleString()}
						</small>
					</p>
					<p className='font-bold leading-tight'>
						{round(tdayCarbs).toLocaleString()} C
						<small className='block text-sm font-normal text-gray-500 dark:text-gray-400'>
							of {carbs.needed.toLocaleString()}
						</small>
					</p>
				</aside>
			</div>
			<div className='mt-4 flex space-x-4 lg:space-x-1 xl:space-x-4'>
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
