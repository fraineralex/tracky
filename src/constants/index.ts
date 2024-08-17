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
