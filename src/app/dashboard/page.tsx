import FoodDialog from './_components/food/food-dialog'
import ExerciseDialog from './_components/exercise/exercise-dialog'
import { Metadata } from 'next'
import Footer from '~/components/layout/footer'
import { Suspense } from 'react'
import { DashboardDataSkeleton } from './_components/skeletons'
import { AddMealButton } from './_components/food/add-meal-button'
import { DashboardData } from './_components/dashboard-data'
import { connection } from 'next/server'

export const metadata: Metadata = {
	title: 'Dashboard'
}

export default async function DashboardPage() {
	await connection()
	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	})

	return (
		<section className='h-full w-full overflow-auto pt-5 sm:mb-0 sm:pb-5'>
			<div className='flex flex-wrap-reverse gap-x-2 gap-y-2 pb-2 md:justify-between'>
				<h1 className='order-last h-full w-full text-center align-bottom text-2xl font-bold uppercase md:order-first md:h-fit md:w-fit'>
					{today}
				</h1>
				<header className='contents md:float-end md:flex md:space-x-5'>
					<Suspense fallback={<AddMealButton />}>
						<FoodDialog />
					</Suspense>
					<Suspense fallback={<AddMealButton />}>
						<ExerciseDialog />
					</Suspense>
				</header>
			</div>
			<Suspense fallback={<DashboardDataSkeleton />}>
				<DashboardData />
			</Suspense>
			<Footer className='fixed bottom-2 right-0 backdrop-blur-none' showAbout />
		</section>
	)
}
