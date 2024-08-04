import { createRouteMatcher, clerkMiddleware } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)'])
const isOnboardingRoute = createRouteMatcher(['/onboarding'])

export default clerkMiddleware((auth, req) => {
	const { userId, sessionClaims, redirectToSignIn } = auth()

	if (userId && isOnboardingRoute(req)) return NextResponse.next()

	if (!userId && !isPublicRoute(req))
		return redirectToSignIn({ returnBackUrl: req.url })

	if (userId && !sessionClaims?.metadata?.onboardingComplete)
		return NextResponse.redirect(new URL('/onboarding', req.url))

	if (userId && !isPublicRoute(req)) return NextResponse.next()
})

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
