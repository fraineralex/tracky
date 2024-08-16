'use client'

import { Button } from '~/components/ui/button'
import { State } from '../_actions'
import {
	Dumbbell,
	Scale,
	Snail,
	Squirrel,
	TrendingDown,
	Turtle
} from 'lucide-react'
import { ACTIVITY_LEVELS, GOALS_OPTIONS } from '~/constants'
import { useState } from 'react'
import OptionItem from './ui/option-item'

export default function FitnessGoals({ formState }: { formState: State }) {
	const [goal, setGoal] = useState<string | null>(null)
	const [activity, setActivity] = useState<string | null>(null)

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
						<OptionItem
							active={goal === GOALS_OPTIONS.loss}
							Icon={TrendingDown}
							title='Lose Weight'
							description='Goal of lossing weight'
							selectItem={() => setGoal(GOALS_OPTIONS.loss)}
						/>
						<OptionItem
							active={goal === GOALS_OPTIONS.maintain}
							Icon={Scale}
							title='Maintain Weight'
							description='Goal of maintenig weight'
							selectItem={() => setGoal(GOALS_OPTIONS.maintain)}
						/>
						<OptionItem
							active={goal === GOALS_OPTIONS.gain}
							Icon={Dumbbell}
							title='Gain Weight'
							description='Goal of gaining weight'
							selectItem={() => setGoal(GOALS_OPTIONS.gain)}
						/>
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
						<OptionItem
							active={activity === ACTIVITY_LEVELS.sedentary}
							Icon={Snail}
							title='Mostly Sedentary'
							description='Less than 5,000 steps a day'
							selectItem={() => setActivity(ACTIVITY_LEVELS.sedentary)}
						/>
						<OptionItem
							active={activity === ACTIVITY_LEVELS.moderate}
							Icon={Turtle}
							title='Mostly Active'
							description='5,000 to 10,000 steps a day'
							selectItem={() => setActivity(ACTIVITY_LEVELS.moderate)}
						/>
						<OptionItem
							active={activity === ACTIVITY_LEVELS.active}
							Icon={Squirrel}
							title='Very Active'
							description='More than 10,000 steps a day'
							selectItem={() => setActivity(ACTIVITY_LEVELS.active)}
						/>
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
