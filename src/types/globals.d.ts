export {}

import { TrakedField, Goal, ActivityLevel, Sex } from './index'

declare global {
	interface CustomJwtSessionClaims {
		metadata: {
			onboardingCompleted?: boolean
		}
	}
	interface UserPublicMetadata {
		onboardingCompleted: boolean
		sex: Sex
		born: string
		goal: { value: Goal; date: string }[]
		height: TrakedField
		weights: TrakedField
		activity: { value: ActivityLevel; date: string }[]
		goalWeight: TrakedField
		fat: { value: number; date: string }[]
		updatedAt: string
	}
}
