import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { type Metadata } from 'next'
import Footer from '~/components/layout/footer'
import { env } from '~/env'
import { i18n, pathWithLocale, type Locale } from '~/i18n-config'
import { hasCompletedOnboarding } from '~/server/onboarding'

export const metadata: Metadata = {
	title: 'Onboarding'
}

export default async function OnboardingLayout({
	children,
	params
}: {
	children: React.ReactNode
	params: Promise<{ lang?: string }>
}) {
	const authResult = await auth()
	const { lang } = await params
	const locale =
		lang && i18n.locales.includes(lang as Locale) ? (lang as Locale) : i18n.defaultLocale

	if (
		env.VERCEL_ENV === 'production' &&
		authResult.userId != null &&
		(await hasCompletedOnboarding(authResult.userId, authResult.sessionClaims))
	) {
		redirect(pathWithLocale('/dashboard', locale))
	}

	return (
		<>
			{children}
			<Footer
				className='bottom-0 left-0 hidden w-full py-3 backdrop-blur-none sm:fixed sm:block'
				showTwitter
				showMadeBy
			/>
		</>
	)
}
