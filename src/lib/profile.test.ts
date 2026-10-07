import { describe, expect, it } from 'vitest'
import {
	applyProfilePatch,
	clearedClerkMetadata,
	hasHeavyMetadata,
	parseLegacyProfile
} from './profile'
import { type UserProfile } from '~/types/profile'

const baseProfile: UserProfile = {
	sex: 'male',
	born: '1990-06-15',
	goal: [{ value: 'maintain', date: '2024-01-01' }],
	height: [{ value: 5.1, date: '2024-01-01' }],
	weights: [
		{ value: 90, date: '2024-01-01' },
		{ value: 85, date: '2024-06-01' }
	],
	activity: [{ value: 'moderate', date: '2024-01-01' }],
	goalWeight: [{ value: 80, date: '2024-01-01' }],
	fat: [{ value: 18, date: '2024-01-01' }],
	updatedAt: '2024-06-01'
}

describe('parseLegacyProfile', () => {
	it('drops the onboarding flag and keeps profile history', () => {
		expect(
			parseLegacyProfile({ ...baseProfile, onboardingCompleted: true })
		).toEqual(baseProfile)
	})

	it('rejects metadata that is only the onboarding flag', () => {
		expect(parseLegacyProfile({ onboardingCompleted: true })).toBeNull()
	})
})

describe('clearedClerkMetadata', () => {
	it('keeps the onboarding flag and nulls profile keys', () => {
		expect(
			clearedClerkMetadata({
				onboardingCompleted: true,
				weights: [{ value: 80, date: '2024-01-01' }],
				progress: [{ value: 10, date: '2024-01-01' }]
			})
		).toMatchObject({
			onboardingCompleted: true,
			weights: null,
			progress: null,
			sex: null,
			goal: null
		})
	})
})

describe('hasHeavyMetadata', () => {
	it('is false when the only claim is the onboarding flag', () => {
		expect(hasHeavyMetadata({ onboardingCompleted: true })).toBe(false)
	})

	it('is true when profile fields are still on the Clerk user', () => {
		expect(hasHeavyMetadata({ onboardingCompleted: true, weights: [] })).toBe(
			true
		)
	})
})

describe('applyProfilePatch', () => {
	it('appends weight history and leaves other fields in place', () => {
		const next = applyProfilePatch(baseProfile, {
			weights: [{ value: 80, date: '2024-07-01' }]
		})

		expect(next.weights).toEqual([
			...baseProfile.weights,
			{ value: 80, date: '2024-07-01' }
		])
		expect(next.goal).toEqual(baseProfile.goal)
		expect(next.fat).toEqual(baseProfile.fat)
		expect(baseProfile.weights).toHaveLength(2)
	})

	it('replaces goal history with the submitted entry', () => {
		const next = applyProfilePatch(baseProfile, {
			goal: [{ value: 'lose', date: '2024-08-01' }]
		})

		expect(next.goal).toEqual([{ value: 'lose', date: '2024-08-01' }])
		expect(next.weights).toEqual(baseProfile.weights)
	})
})
