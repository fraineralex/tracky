export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingCompleted?: boolean
    }
  }
}
