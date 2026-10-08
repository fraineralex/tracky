/** Reads the onboarding flag from a Clerk session token. Pure: no I/O. */
export function onboardingClaimValue(
	sessionClaims: unknown
): boolean | undefined {
	if (typeof sessionClaims !== 'object' || sessionClaims === null) {
		return undefined
	}
	if (!('metadata' in sessionClaims)) return undefined

	const metadata = sessionClaims.metadata
	if (typeof metadata !== 'object' || metadata === null) return undefined
	if (!('onboardingCompleted' in metadata)) return undefined

	const value = metadata.onboardingCompleted
	if (value === true || value === 'true') return true
	if (value === false || value === 'false') return false
	return undefined
}
