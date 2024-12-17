import { Suspense } from 'react'
import { SettingItems } from './_sections/setting-items'
import { Metadata } from 'next'
import { SettingItemsSkeletonUI } from './_components/skeletons'
import Footer from '~/components/layout/footer'

export const metadata: Metadata = {
	title: 'Settings'
}

export default function SettingsPage() {
	return (
		<section className='container mx-auto py-5'>
			<header className='mb-8 flex flex-col gap-1'>
				<h1 className='text-2xl font-bold'>Settings</h1>
				<h2 className='text-sm text-muted-foreground'>
					Configure the settings for this application
				</h2>
			</header>
			<Suspense fallback={<SettingItemsSkeletonUI />}>
				<SettingItems />
			</Suspense>
			<Footer className='-left-4 bottom-0 hidden w-full py-3 backdrop-blur-none sm:fixed sm:block' />
		</section>
	)
}
