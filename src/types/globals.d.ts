export {}

import { Weights, Goal, ActivityLevel, Sex } from './index'

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
		goal: Goal
		height: number
		weights: Weights
		activity: ActivityLevel
		heightUnit: string
		goalWeight: number
		weightUnit: string
		fat?: number
		updatedAt: string
	}
}
