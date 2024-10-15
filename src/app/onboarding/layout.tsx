import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import Footer from '~/components/layout/footer'

export const metadata: Metadata = {
	title: 'Onboarding'
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	if (auth().sessionClaims?.metadata?.onboardingCompleted === true) {
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
