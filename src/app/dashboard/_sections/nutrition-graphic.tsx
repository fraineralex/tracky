'use client'

import { Flame } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/ui/button'
import { NutritionMetrics } from '~/types'

export default function NutritionGraphic({
	calories,
	protein,
	carbs,
	fats
}: NutritionMetrics) {
	const [showConsumed, setShowConsumed] = React.useState(true)

	const dayOfWeek = new Date().getDay()
	const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
	const percentage = 20
	const nutrition: { [key: number]: number[] } = {
		0: [10, 40, 80, 90],
		1: [90, 20, 20, 35],
		2: [20, 60, 50, 70],
		3: [50, 30, 90, 20],
		4: [40, 90, 25, 40],
		5: [65, 50, 65, 80],
		6: [30, 80, 30, 50]
	}
	const colors = ['#60a5fa', '#fb923c', '#facc15', '#4ade80']
	return (
		<article className='h-fit w-full max-w-[490px] rounded-lg border bg-slate-200 p-5 dark:bg-slate-800/50'>
			<h2 className='mb-3'>Nutrition & Targets</h2>
			<div className='mb-2 grid grid-cols-10 space-x-5'>
				<div className='col-span-8 grid grid-flow-row space-y-2'>
					{[...Array(4)].map((_, index) => (
						<div className='flex space-x-5 border-b pb-2' key={index}>
							{[...Array(7)].map((_, index2) => (
								<span
									className={`rounded-md px-4 py-4 ${index2 === dayOfWeek - 1 ? 'border-2 border-primary' : ''}`}
									key={index2}
									style={{
										background: `linear-gradient(to top, ${colors[index]} ${nutrition[index2]?.[index]}%, hsl(var(--primary) / 0.2) ${nutrition[index2]?.[index]}%)`
									}}
								></span>
							))}
						</div>
					))}
				</div>
				<aside className='col-span-2 flex flex-col place-content-center justify-between'>
					<p className='font-bold leading-tight'>
						{(showConsumed ? calories.consumed : calories.remaining).toFixed(0)}{' '}
						<Flame className='inline h-6 w-6 pb-1' />
						<small className='block text-sm font-normal text-gray-500 dark:text-gray-400'>
							of {calories.needed.toFixed(0)}
						</small>
					</p>
					<p className='font-bold leading-tight'>
						{(showConsumed ? protein.consumed : protein.remaining).toFixed(0)} P
						<small className='block text-sm font-normal text-gray-500 dark:text-gray-400'>
							of {protein.needed.toFixed(0)}
						</small>
					</p>
					<p className='font-bold leading-tight'>
						{(showConsumed ? fats.consumed : fats.remaining).toFixed(0)} F
						<small className='block text-sm font-normal text-gray-500 dark:text-gray-400'>
							of {fats.needed.toFixed(0)}
						</small>
					</p>
					<p className='font-bold leading-tight'>
						{(showConsumed ? carbs.consumed : carbs.remaining).toFixed(0)} C
						<small className='block text-sm font-normal text-gray-500 dark:text-gray-400'>
							of {carbs.needed.toFixed(0)}
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
