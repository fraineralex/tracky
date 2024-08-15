'use client'

import { Button } from '~/components/ui/button'
import { State } from '../_actions'
import { Cat, Dumbbell, Scale, Snail, Squirrel, TrendingDown } from 'lucide-react'
import { GOALS_OPTIONS } from '~/constants'
import { useState } from 'react'

export default function FitnessGoals({ formState }: { formState: State }) {
	const [goal, setGoal] = useState<string | null>(null)
	return (
		<section className='z-10 mx-5 flex flex-col items-center space-y-10 text-center sm:mx-auto'>
			<h1 className='font-serif text-3xl font-bold text-green-600 dark:text-green-500'>
				trac<span className='text-wood-950 dark:text-wood-100'>ky</span>
			</h1>
			<aside className='flex flex-col space-x-20 sm:mx-auto md:flex-row'>
				<article className='space-y-1'>
					<h2 className='font-display max-w-md text-start text-sm font-semibold transition-colors'>
						What is your goal?
					</h2>
					<div className='flex flex-col space-y-5 py-5'>
						<button
							className={`flex min-w-[320px] items-center justify-start space-x-5 overflow-hidden rounded-lg border border-gray-500 p-5 transition-colors hover:dark:bg-gray-800 ${goal === GOALS_OPTIONS.loss ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
							type='button'
						>
							<TrendingDown className='pointer-events-none h-auto w-5' />
							<span className='space-y-2 text-left'>
								<p className='text-base font-medium'>Lose Weight</p>
								<small className='text-sm font-light text-gray-400'>
									Goal of lossing weight
								</small>
							</span>
						</button>
						<button
							className={`flex min-w-[320px] items-center justify-start space-x-5 overflow-hidden rounded-lg border border-gray-500 p-5 transition-colors hover:dark:bg-gray-800 ${goal === GOALS_OPTIONS.loss ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
							type='button'
						>
							<Scale className='pointer-events-none h-auto w-5' />
							<span className='space-y-2 text-left'>
								<p className='text-base font-medium'>Maintain Weight</p>
								<small className='text-sm font-light text-gray-400'>
									Goal of maintenig weight
								</small>
							</span>
						</button>
						<button
							className={`flex min-w-[320px] items-center justify-start space-x-5 overflow-hidden rounded-lg border border-gray-500 p-5 transition-colors hover:dark:bg-gray-800 ${goal === GOALS_OPTIONS.loss ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
							type='button'
						>
							<Dumbbell className='pointer-events-none h-auto w-5' />
							<span className='space-y-2 text-left'>
								<p className='text-base font-medium'>Gain Weight</p>
								<small className='text-sm font-light text-gray-400'>
									Goal of gainig weight
								</small>
							</span>
						</button>
					</div>
					<input type='hidden' name='goal' required />
					{formState.errors?.goal ? (
						<div
							id='goal-error'
							aria-live='polite'
							className='mt-2 text-sm text-red-500'
						>
							{formState.errors.goal.map((error: string) => (
								<p key={error}>{error}</p>
							))}
						</div>
					) : null}
				</article>
				<article className='space-y-1'>
					<h2 className='font-display max-w-md text-start text-sm font-semibold transition-colors'>
						How active are you?
					</h2>
					<div className='flex flex-col space-y-5 py-5'>
						<button
							className={`flex w-[320px] items-center justify-start space-x-5 overflow-hidden rounded-lg border border-gray-500 p-5 transition-colors hover:dark:bg-gray-800 ${goal === GOALS_OPTIONS.loss ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
							type='button'
						>
							<Snail className='pointer-events-none h-auto w-5' />
							<span className='space-y-2 text-left'>
								<p className='text-base font-medium'>Mostly Sedentary</p>
								<small className='text-sm font-light text-gray-400'>
									Less than 5,000 steps a day
								</small>
							</span>
						</button>
						<button
							className={`flex min-w-[320px] items-center justify-start space-x-5 overflow-hidden rounded-lg border border-gray-500 p-5 transition-colors hover:dark:bg-gray-800 ${goal === GOALS_OPTIONS.loss ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
							type='button'
						>
							<Cat className='pointer-events-none h-auto w-5' />
							<span className='space-y-2 text-left'>
								<p className='text-base font-medium'>Moderately Active</p>
								<small className='text-sm font-light text-gray-400'>
									5,000 to 10,000 steps a day
								</small>
							</span>
						</button>
						<button
							className={`flex min-w-[320px] items-center justify-start space-x-5 overflow-hidden rounded-lg border border-gray-500 p-5 transition-colors hover:dark:bg-gray-800 ${goal === GOALS_OPTIONS.loss ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
							type='button'
						>
							<Squirrel className='pointer-events-none h-auto w-5' />
							<span className='space-y-2 text-left'>
								<p className='text-base font-medium'>Very Active</p>
								<small className='text-sm font-light text-gray-400'>
									More than 10,000 steps a day
								</small>
							</span>
						</button>
					</div>
					<input type='hidden' name='activity' required />
					{formState.errors?.activity ? (
						<div
							id='activity-error'
							aria-live='polite'
							className='mt-2 text-sm text-red-500'
						>
							{formState.errors.activity.map((error: string) => (
								<p key={error}>{error}</p>
							))}
						</div>
					) : null}
				</article>
			</aside>
			<Button type='submit'>Submit</Button>
		</section>
	)
}
