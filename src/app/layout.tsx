import '~/styles/globals.css'
import { GeistSans } from 'geist/font/sans'
import {
	ClerkProvider,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton
} from '@clerk/nextjs'

export const metadata = {
	title: 'Tracky',
	description: 'Track fitness metrics like body fat, calories, and protein.',
	icons: [{ rel: 'icon', url: '/favicon.ico' }]
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<ClerkProvider>
			<html lang='en' className={`${GeistSans.variable}`}>
				<body>
					<SignedOut>
						<SignInButton />
					</SignedOut>
					<SignedIn>
						<UserButton />
					</SignedIn>
					{children}
				</body>
			</html>
		</ClerkProvider>
	)
}
