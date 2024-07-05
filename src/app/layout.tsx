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
	variable: '--font-serif',

})

export const metadata = {
	title: 'Tracky',
	description: 'Track fitness metrics like body fat, calories, and protein.',
	icons: [
		{ rel: 'icon', url: '/favicon.png', type: 'image/png', sizes: '16x16' },
		{
			rel: 'icon',
			url: '/assets/icon32.png',
			type: 'image/png',
			sizes: '32x32'
		},
		{
			rel: 'apple-touch-icon',
			url: '/assets/icon96.png',
			type: 'image/png',
			sizes: '96x96'
		}
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
						'bg-background min-h-screen font-sans antialiased',
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
