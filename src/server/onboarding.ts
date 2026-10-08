import { clerkClient } from '@clerk/nextjs/server'
import { onboardingClaimValue } from '~/lib/onboarding'

/**
 * Session claim is a fast path only. When it is missing or not true,
 * Clerk `publicMetadata.onboardingCompleted` is the source of truth.
 * No `server-only` import: this runs from proxy middleware.
 */
export async function hasCompletedOnboarding(
	userId: string,
	sessionClaims: unknown
): Promise<boolean> {
	if (onboardingClaimValue(sessionClaims) === true) return true

	try {
		const client = await clerkClient()
		const user = await client.users.getUser(userId)
		return user.publicMetadata?.onboardingCompleted === true
	} catch (error) {
		console.error('Failed to read Clerk onboarding status', error)
		return false
	}
}
