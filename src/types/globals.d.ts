export {}

import { Weights, Goal, ActivityLevel, Sex, Unit } from './index'

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
		heightUnit: Unit
		goalWeight: number
		weightUnit: Unit
		fat: number
		updatedAt: string
	}
}
