import { createRouteMatcher, clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { i18n } from './i18n-config'
import { hasCompletedOnboarding } from './server/onboarding'

function getLocale(request: NextRequest): string {
	const negotiatorHeaders: Record<string, string> = {}
	request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

	const locales: string[] = [...i18n.locales]
	const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
		locales
	)

	try {
		return matchLocale(languages, locales, i18n.defaultLocale)
	} catch {
		return i18n.defaultLocale
	}
}

function getPathnameWithoutLocale(pathname: string): string {
	for (const locale of i18n.locales) {
		if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
			return pathname.replace(`/${locale}`, '') || '/'
		}
	}
	return pathname
}

function getLocaleFromPathname(pathname: string): string | null {
	for (const locale of i18n.locales) {
		if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
			return locale
		}
	}
	return null
}

// Create route matchers that work with locale prefixes
function createLocalizedRouteMatcher(patterns: string[]) {
	const allPatterns: string[] = []
	for (const pattern of patterns) {
		allPatterns.push(pattern)
		for (const locale of i18n.locales) {
			if (locale !== i18n.defaultLocale) {
				if (pattern === '/') {
					allPatterns.push(`/${locale}`)
				} else {
					allPatterns.push(`/${locale}${pattern}`)
				}
			}
		}
	}
	return createRouteMatcher(allPatterns)
}

const isPublicRoute = createLocalizedRouteMatcher([
	'/',
	'/sign-in(.*)',
	'/sign-up(.*)'
])
const isOnboardingRoute = createLocalizedRouteMatcher(['/onboarding'])

export default clerkMiddleware(async (auth, req: NextRequest) => {
	const pathname = req.nextUrl.pathname

	if (
		pathname.startsWith('/api') ||
		pathname.startsWith('/_next') ||
		pathname.startsWith('/trpc') ||
		pathname.includes('.')
	) {
		return NextResponse.next()
	}

	const pathnameLocale = getLocaleFromPathname(pathname)
	const detectedLocale = getLocale(req)

	let locale = pathnameLocale ?? i18n.defaultLocale
	const pathnameWithoutLocale = getPathnameWithoutLocale(pathname)

	if (pathnameLocale === i18n.defaultLocale) {
		const url = req.nextUrl.clone()
		url.pathname = pathnameWithoutLocale
		return NextResponse.redirect(url)
	}

	if (!pathnameLocale && detectedLocale !== i18n.defaultLocale) {
		const url = req.nextUrl.clone()
		url.pathname = `/${detectedLocale}${pathname === '/' ? '' : pathname}`
		return NextResponse.redirect(url)
	}

	if (!pathnameLocale) {
		locale = i18n.defaultLocale
	}

	let rewriteUrl: URL | null = null
	if (!pathnameLocale) {
		rewriteUrl = req.nextUrl.clone()
		rewriteUrl.pathname = `/${i18n.defaultLocale}${pathname === '/' ? '' : pathname}`
	}

	const { userId, sessionClaims, redirectToSignIn } = await auth()

	const response = rewriteUrl
		? NextResponse.rewrite(rewriteUrl)
		: NextResponse.next()
	response.headers.set('x-locale', locale)

	if (userId && isOnboardingRoute(req)) return response

	if (!userId && !isPublicRoute(req)) {
		return redirectToSignIn({ returnBackUrl: req.url })
	}

	if (userId && !(await hasCompletedOnboarding(userId, sessionClaims))) {
		const onboardingUrl =
			locale === i18n.defaultLocale ? '/onboarding' : `/${locale}/onboarding`
		return NextResponse.redirect(new URL(onboardingUrl, req.url))
	}

	if (userId && !isPublicRoute(req)) return response

	return response
})
export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
