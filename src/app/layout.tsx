import '~/styles/globals.css'
import { Inter as FontSans, Lora as FontSerif } from 'next/font/google'
import { cn } from '~/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'
import { Header } from '~/components/layout/header'
import { ThemeProvider } from '~/components/providers/theme-provider'

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans'
})

const fontSerif = FontSerif({
	subsets: ['latin'],
	variable: '--font-serif'
})

export const metadata = {
	title: 'Tracky',
	description: 'Track fitness metrics like body fat, calories, and protein.',
	icons: [
		{ rel: 'icon', url: '/favicon.png', type: 'image/png', sizes: '32x32' }
	]
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<ClerkProvider>
			<html lang='en' suppressHydrationWarning>
				<body
					className={cn(
						'min-h-screen bg-background font-sans antialiased',
						fontSans.variable,
						fontSerif.variable
					)}
				>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange
					>
						<div className='grid h-screen grid-rows-[auto,1fr]'>
							<Header />
							<main className='overflow-y-auto'>{children}</main>
						</div>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
