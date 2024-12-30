import '~/styles/globals.css'
import { Inter as FontSans, Lora as FontSerif } from 'next/font/google'
import { cn } from '~/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'
import { Header } from '~/components/layout/header'
import { ThemeProvider } from '~/components/providers/theme-provider'
import SideNav from '~/components/layout/sidenav'
import Toaster from '~/components/ui/sonner'
import { Metadata } from 'next'
import { Suspense } from 'react'
import Loading from './loading'
import { env } from '~/env'
import { Analytics } from '@vercel/analytics/next'

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
		default: 'tracky',
		template: '%s / tracky'
	},
	description:
		'Fitness tracking web app with AI-powered features to quickly log meals and exercises.',
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
		'ai',
		'web app'
	],
	metadataBase: new URL(env.DOMAIN),
	openGraph: {
		title: 'tracky',
		description:
			'Fitness tracking web app with AI-powered features to quickly log meals and exercises.',
		images: [
			{
				url: `https://pub-f159aa4256dd4a64ae2f0c18d87e674e.r2.dev/og.webp`,
				width: 1920,
				height: 675,
				type: 'image/webp'
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
		title: 'tracky',
		description:
			'Fitness tracking web app with AI-powered features to quickly log meals and exercises.',
		images: [
			{
				url: `https://pub-f159aa4256dd4a64ae2f0c18d87e674e.r2.dev/og.webp`,
				width: 1200,
				height: 675,
				type: 'image/webp'
			}
		],
		creatorId: 'fraineralex'
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
					'mx-auto min-h-screen bg-background pb-5 font-sans antialiased md:max-w-screen-2xl',
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
					<div className='mx-auto min-h-screen w-full min-w-80 overflow-y-auto md:grid md:max-w-screen-xl md:grid-rows-[auto,1fr]'>
						<Suspense fallback={<Loading />}>
							<ClerkProvider afterSignOutUrl='/' dynamic>
								<Header />
								<main className='px-4 md:flex md:px-10'>
									<SideNav />
									{children}
								</main>
							</ClerkProvider>
						</Suspense>
					</div>
					<Toaster richColors />
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	)
}
