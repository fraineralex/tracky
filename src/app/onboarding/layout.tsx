import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import Footer from '~/components/layout/footer'
import { env } from '~/env'

export const metadata: Metadata = {
	title: 'Onboarding'
}

export default async function OnboardingLayout({
	children
}: {
	children: React.ReactNode
}) {
	const authResult = await auth()

	if (
		authResult.sessionClaims?.metadata?.onboardingCompleted === true &&
		env.VERCEL_ENV !== 'development'
	) {
		redirect('/dashboard')
	}

	return (
		<>
			{children}
			<Footer
				className='bottom-0 left-0 hidden w-full py-3 backdrop-blur-none sm:fixed sm:block'
				showTwitter
			/>
		</>
	)
}
