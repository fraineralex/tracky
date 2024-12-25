'use client'

import { Flame } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { round, calculateAdjustedDay } from '~/lib/calculations'
import { NutritionMetrics, NutritionMetricsPerDay } from '~/types'
import { NutritionSquare } from '../_components/analytics/nutrition-square'

export default function NutritionGraphic({
	nutritionMetrics: nutrition
}: {
	nutritionMetrics: NutritionMetricsPerDay
}) {
	const [showConsumed, setShowConsumed] = React.useState(true)

	const dayOfWeek = calculateAdjustedDay(new Date())
	const { calories, protein, fats, carbs } = nutrition[
		dayOfWeek as keyof NutritionMetricsPerDay
	] as NutritionMetrics

	const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
	function getNutrientPercentage(index: number, day: number) {
		if (day > dayOfWeek) return showConsumed ? 0 : 100
		if (!nutrition[day]) return 0
		const nutrient = Object.values(nutrition[day] ?? {})[
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
		tdayCalories = Math.max(calories.needed - calories.consumed, 0)
		tdayProtein = Math.max(protein.needed - protein.consumed, 0)
		tdayFats = Math.max(fats.needed - fats.consumed, 0)
		tdayCarbs = Math.max(carbs.needed - carbs.consumed, 0)
	}

	return (
		<Card className='mx-auto h-fit w-full rounded-lg border p-2 pr-1 dark:bg-slate-800/50 sm:p-5 md:mx-0 lg:max-w-96 xl:max-w-[490px]'>
			<h2 className='mb-3 font-semibold'>Nutrition & Targets</h2>
			<div className='mb-2 grid grid-cols-10 space-x-1 sm:space-x-5 lg:space-x-3 xl:space-x-5'>
				<div className='col-span-8 grid grid-flow-row space-y-2'>
					{[...Array(5)].map((_, nutrientIndex) => (
						<div
							className={`flex pb-2 ${nutrientIndex === 4 ? 'space-x-1 sm:space-x-4 lg:space-x-1 xl:space-x-4' : 'space-x-2 sm:space-x-5 lg:space-x-2 xl:space-x-5'}`}
							key={nutrientIndex}
						>
							{[...Array(8)].map((_, dayIndex) => (
								<NutritionSquare
									key={dayIndex}
									dayIndex={dayIndex}
									nutrientIndex={nutrientIndex}
									dayOfWeek={dayOfWeek}
									percentage={
										nutrientIndex < 4
											? getNutrientPercentage(nutrientIndex, dayIndex).toFixed()
											: '0'
									}
									days={days}
								/>
							))}
						</div>
					))}
				</div>
				<aside className='col-span-2 flex flex-col space-y-4 text-center text-sm sm:place-content-center sm:justify-between sm:space-y-0'>
					<p className='-me-5 font-bold leading-tight sm:-me-0'>
						{round(tdayCalories).toLocaleString()}
						<Flame className='inline h-6 w-6 pb-1' />
						<small className='font-xs block font-normal text-gray-500 dark:text-gray-400 sm:text-sm'>
							of {calories.needed.toLocaleString()}
						</small>
					</p>
					<p className='-me-5 font-bold leading-tight sm:-me-0'>
						{round(tdayProtein).toLocaleString()} P
						<small className='font-xs block font-normal text-gray-500 dark:text-gray-400 sm:text-sm'>
							of {protein.needed.toLocaleString()}
						</small>
					</p>
					<p className='-me-5 font-bold leading-tight sm:-me-0'>
						{round(tdayFats).toLocaleString()} F
						<small className='font-xs block font-normal text-gray-500 dark:text-gray-400 sm:text-sm'>
							of {fats.needed.toLocaleString()}
						</small>
					</p>
					<p className='-me-5 font-bold leading-tight sm:-me-0'>
						{round(tdayCarbs).toLocaleString()} C
						<small className='font-xs block font-normal text-gray-500 dark:text-gray-400 sm:text-sm'>
							of {carbs.needed.toLocaleString()}
						</small>
					</p>
				</aside>
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
		</Card>
	)
}
