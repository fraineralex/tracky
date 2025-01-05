import { Header } from '~/app/exercise/_sections/header'
import { Metadata } from 'next'
import { Suspense } from 'react'
import {
	ExerciseMetricsSkeleton,
	HeaderSkeleton
} from './_components/skeletons'
import { ExerciseMetrics } from './_components/exercise-metrics'
import { connection } from 'next/server'
import Footer from '~/components/layout/footer'

export const metadata: Metadata = {
	title: 'Exercise'
}

export default async function ExercisePage() {
	await connection()
	return (
		<section className='mx-auto min-h-screen w-full bg-background px-0 py-5 text-foreground'>
			<Suspense fallback={<HeaderSkeleton />}>
				<Header />
			</Suspense>
			<Suspense fallback={<ExerciseMetricsSkeleton />}>
				<ExerciseMetrics />
			</Suspense>
			<Footer className='fixed bottom-0 right-0 backdrop-blur-none' showAbout />
		</section>
	)
}
