import { Dumbbell } from 'lucide-react'
import {
	Cleaner,
	Contruction,
	Cycling,
	Runnig,
	SoccerKick,
	Stretching,
	Treadmill
} from '~/components/ui/icons'

export const ONBOARDING_SECTIONS = {
	personal: 'personal-info',
	metrics: 'body-metrics',
	goals: 'fitness-goals'
}

export const GOALS_OPTIONS = {
	loss: 'loss',
	maintain: 'maintain',
	gain: 'gain'
}

export const ACTIVITY_LEVELS = {
	sedentary: 'sedentary',
	moderate: 'moderate',
	active: 'active'
}

export const STAGGER_CHILD_VARIANTS = {
	hidden: {
		opacity: 0,
		y: 20
	},
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			type: 'spring'
		}
	}
}

export const UNITS_MAP = {
	g: 'gram',
	ml: 'milliliter',
	oz: 'ounce',
	cup: 'cup'
}

export const EXERCISE_CATEGORIES = [
	{
		title: 'Gym',
		icon: Dumbbell,
		label: '🏋️‍♂️ Gym Workout'
	},
	{
		title: 'Cardio',
		icon: Treadmill,
		label: '🏃‍♂️ Cardio Workout'
	},
	{
		title: 'Household Activity',
		icon: Cleaner,
		label: '🧹 Household Chores'
	},
	{
		title: 'Individual Sport',
		icon: Runnig,
		label: '🤸‍♂️ Individual Sport Activity'
	},
	{
		title: 'Team Sport',
		icon: SoccerKick,
		label: '⚽ Team Sport Activity'
	},
	{
		title: 'Outdoor Activity',
		icon: Cycling,
		label: '🚴‍♂️ Outdoor Activity'
	},
	{
		title: 'Stretching & Mobility',
		icon: Stretching,
		label: '🤸‍♀️ Stretching & Mobility'
	},
	{
		title: 'Ocupational Activity',
		icon: Contruction,
		label: '👷‍♂️ Ocupational Activity'
	}
]

export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number]
