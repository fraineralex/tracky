export {}

declare global {
	// Only the onboarding flag belongs in the session token. Clerk copies
	// public metadata into the `__session` cookie, and profile history would
	// push that cookie over the browser's 4KB limit.
	interface CustomJwtSessionClaims {
		metadata: {
			onboardingCompleted?: boolean
		}
	}
	interface UserPublicMetadata {
		onboardingCompleted?: boolean
	}
}
