import { describe, expect, it } from 'vitest'
import { onboardingClaimValue } from './onboarding'

describe('onboardingClaimValue', () => {
	it('returns true for boolean true', () => {
		expect(
			onboardingClaimValue({ metadata: { onboardingCompleted: true } })
		).toBe(true)
	})

	it("returns true for the string 'true'", () => {
		expect(
			onboardingClaimValue({ metadata: { onboardingCompleted: 'true' } })
		).toBe(true)
	})

	it('returns false for boolean false', () => {
		expect(
			onboardingClaimValue({ metadata: { onboardingCompleted: false } })
		).toBe(false)
	})

	it("returns false for the string 'false'", () => {
		expect(
			onboardingClaimValue({ metadata: { onboardingCompleted: 'false' } })
		).toBe(false)
	})

	it('returns undefined when metadata is missing', () => {
		expect(onboardingClaimValue({})).toBeUndefined()
		expect(onboardingClaimValue({ metadata: {} })).toBeUndefined()
	})

	it('returns undefined for null claims', () => {
		expect(onboardingClaimValue(null)).toBeUndefined()
	})

	it('returns undefined for other values', () => {
		expect(
			onboardingClaimValue({ metadata: { onboardingCompleted: 'yes' } })
		).toBeUndefined()
		expect(
			onboardingClaimValue({ metadata: { onboardingCompleted: 1 } })
		).toBeUndefined()
		expect(
			onboardingClaimValue({ metadata: { onboardingCompleted: null } })
		).toBeUndefined()
	})
})
