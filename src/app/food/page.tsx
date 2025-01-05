import { Header } from './sections/header'
import { Metadata } from 'next'
import Footer from '~/components/layout/footer'
import { Suspense } from 'react'
import { FoodMeatricsSkeleton, HeaderSkeleton } from './_components/skeletons'
import { FoodMeatrics } from './sections/food-meatrics'
import { connection } from 'next/server'

export const metadata: Metadata = {
	title: 'Food'
}

export default async function FoodPage() {
	await connection()
	return (
		<>
			<section className='container mx-auto px-0 py-5'>
				<Suspense fallback={<HeaderSkeleton />}>
					<Header />
				</Suspense>
				<Suspense fallback={<FoodMeatricsSkeleton />}>
					<FoodMeatrics />
				</Suspense>
			</section>
			<Footer className='fixed bottom-0 right-0 backdrop-blur-none' showAbout />
		</>
	)
}
