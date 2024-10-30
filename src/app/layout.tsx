import '~/styles/globals.css'
import { Inter as FontSans, Lora as FontSerif } from 'next/font/google'
import { cn } from '~/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'
import { Header } from '~/components/layout/header'
import { ThemeProvider } from '~/components/providers/theme-provider'
import SideNav from '~/components/layout/sidenav'
import Toaster from '~/components/ui/sonner'
import { Metadata } from 'next'

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans'
})

const fontSerif = FontSerif({
	subsets: ['latin'],
	variable: '--font-serif'
})

export const metadata: Metadata = {
	title: {
		default: 'Tracky',
		template: '%s | Tracky'
	},
	description:
		'Fitness tracking web app with AI-powered features to quickly log meals and exercises,',
	icons: [
		{ rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' }
	],
	category: 'Health & Fitness',
	keywords: [
		'fitness',
		'health',
		'exercise',
		'nutrition',
		'food',
		'AI',
		'web app'
	],
	metadataBase: new URL(process.env.DOMAIN ?? 'https://tracky.fraineralex.dev'),
	openGraph: {
		title: 'Tracky',
		description:
			'Fitness tracking web app with AI-powered features to quickly log meals and exercises,',
		images: [
			{
				url: '/og.jpg',
				width: 1920,
				height: 675
			}
		],
		locale: 'en_US',
		type: 'website'
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1
		}
	},
	twitter: {
		card: 'summary_large_image',
		creator: '@fraineralex',
		site: '@fraineralex',
		title: 'Tracky',
		description:
			'Fitness tracking web app with AI-powered features to quickly log meals and exercises,',
		images: [
			{
				url: '/og.jpg',
				width: 1920,
				height: 675
			}
		]
	}
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body
				className={cn(
					'mx-auto min-h-screen bg-background pb-5 font-sans antialiased md:max-w-screen-xl',
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
					<div className='min-h-screen overflow-y-auto md:grid md:grid-rows-[auto,1fr]'>
						<ClerkProvider afterSignOutUrl='/' dynamic>
							<Header />
							<main className='px-5 md:flex md:px-10'>
								<SideNav />
								{children}
							</main>
						</ClerkProvider>
					</div>
					<Toaster richColors />
				</ThemeProvider>
			</body>
		</html>
	)
}
