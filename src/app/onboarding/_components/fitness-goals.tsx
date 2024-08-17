'use strict'

import {
	ChevronLeft,
	Dumbbell,
	Scale,
	Snail,
	Squirrel,
	TrendingDown,
	Turtle
} from 'lucide-react'
import {
	ACTIVITY_LEVELS,
	GOALS_OPTIONS,
	ONBOARDING_SECTIONS
} from '~/constants'
import OptionItem from './ui/option-item'
import { Button } from '~/components/ui/button'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { STAGGER_CHILD_VARIANTS } from '~/constants'

export default function FitnessGoals({
	setShowSection,
	goal,
	activity,
	sendForm,
	showSection
}: {
	setShowSection: (section: string) => void
	goal: {
		value: string | undefined
		setValue: (value: string | undefined) => void
	}
	activity: {
		value: string | undefined
		setValue: (value: string | undefined) => void
	}
	sendForm: () => void
	showSection: boolean
}) {
	const goalInputRef = useRef<HTMLInputElement | null>(null)
	const activityInputRef = useRef<HTMLInputElement | null>(null)

	const handleSelectGoal = (value: string) => () => {
		goal.setValue(value)
		if (activityInputRef.current) activityInputRef.current.value = value
		if (value && activity.value) sendForm()
	}

	const handleSelectActivity = (value: string) => () => {
		activity.setValue(value)
		if (activityInputRef.current) activityInputRef.current.value = value

		if (value && goal.value) sendForm()
	}

	return (
		<motion.section
			className={`z-10 mx-5 ${showSection ? 'flex' : 'hidden'} flex-col items-center space-y-16 text-center sm:mx-auto`}
			variants={{
				hidden: { opacity: 0, scale: 0.95 },
				show: { opacity: 1, scale: 1, transition: { staggerChildren: 0.2 } }
			}}
			initial='hidden'
			animate='show'
			exit='hidden'
			transition={{ duration: 0.3, type: 'spring' }}
		>
			<motion.h1
				variants={STAGGER_CHILD_VARIANTS}
				className='font-serif text-3xl font-bold text-green-600 dark:text-green-500'
			>
				trac<span className='text-wood-950 dark:text-wood-100'>ky</span>
			</motion.h1>
			<aside className='flex flex-col space-x-20 sm:mx-auto md:flex-row'>
				<article className='space-y-1'>
					<motion.h2
						variants={STAGGER_CHILD_VARIANTS}
						className='font-display max-w-md text-start text-sm font-semibold transition-colors'
					>
						What is your goal?
					</motion.h2>
					<motion.div
						className='flex flex-col space-y-5 py-5'
						variants={STAGGER_CHILD_VARIANTS}
					>
						<OptionItem
							active={goal.value === GOALS_OPTIONS.loss}
							Icon={TrendingDown}
							title='Lose Weight'
							description='Goal of lossing weight'
							selectItem={handleSelectGoal(GOALS_OPTIONS.loss)}
						/>
						<OptionItem
							active={goal.value === GOALS_OPTIONS.maintain}
							Icon={Scale}
							title='Maintain Weight'
							description='Goal of maintenig weight'
							selectItem={handleSelectGoal(GOALS_OPTIONS.maintain)}
						/>
						<OptionItem
							active={goal.value === GOALS_OPTIONS.gain}
							Icon={Dumbbell}
							title='Gain Weight'
							description='Goal of gaining weight'
							selectItem={handleSelectGoal(GOALS_OPTIONS.gain)}
						/>
					</motion.div>
					<input
						type='hidden'
						name='goal'
						required
						value={goal.value}
						ref={goalInputRef}
					/>
				</article>
				<article className='space-y-1'>
					<motion.h2
						variants={STAGGER_CHILD_VARIANTS}
						className='font-display max-w-md text-start text-sm font-semibold transition-colors'
					>
						How active are you?
					</motion.h2>
					<motion.div
						className='flex flex-col space-y-5 py-5'
						variants={STAGGER_CHILD_VARIANTS}
					>
						<OptionItem
							active={activity.value === ACTIVITY_LEVELS.sedentary}
							Icon={Snail}
							title='Mostly Sedentary'
							description='Less than 5,000 steps a day'
							selectItem={handleSelectActivity(ACTIVITY_LEVELS.sedentary)}
						/>
						<OptionItem
							active={activity.value === ACTIVITY_LEVELS.moderate}
							Icon={Turtle}
							title='Mostly Active'
							description='5,000 to 10,000 steps a day'
							selectItem={handleSelectActivity(ACTIVITY_LEVELS.moderate)}
						/>
						<OptionItem
							active={activity.value === ACTIVITY_LEVELS.active}
							Icon={Squirrel}
							title='Very Active'
							description='More than 10,000 steps a day'
							selectItem={handleSelectActivity(ACTIVITY_LEVELS.active)}
						/>
					</motion.div>
					<input
						type='hidden'
						name='activity'
						value={activity.value}
						ref={activityInputRef}
						required
					/>
				</article>
			</aside>
			<motion.footer
				className='flex w-full justify-start'
				variants={STAGGER_CHILD_VARIANTS}
			>
				<Button
					type='button'
					variant='secondary'
					className='text-base font-medium'
					onClick={() => setShowSection(ONBOARDING_SECTIONS.metrics)}
				>
					<ChevronLeft />
				</Button>
			</motion.footer>
		</motion.section>
	)
}
