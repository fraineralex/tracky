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

	return (
		<article className='h-fit w-full max-w-[490px] rounded-lg border bg-slate-200 p-5 dark:bg-slate-800/50'>
			<h2 className='mb-3'>Nutrition & Targets</h2>
			<div className='mb-2 grid grid-cols-10 space-x-5'>
				<div className='col-span-8 grid grid-flow-row space-y-2'>
					{[...Array(4)].map((_, index) => (
						<div className='flex space-x-5 border-b pb-2' key={index}>
							{[...Array(7)].map((_, index2) => (
								<span
									className={`rounded-md bg-primary/20 px-4 py-5 ${index2 === 3 ? 'border-2 border-primary' : ''}`}
									key={index2}
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
			<div className='mt-4 flex space-x-10'>
				<span className='ps-2'>T</span>
				<span className=''>M</span>
				<span className=''>W</span>
				<span className=''>T</span>
				<span className=''>F</span>
				<span className=''>S</span>
				<span className='ps-2'>S</span>
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
