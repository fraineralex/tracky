import { Header } from '~/app/[lang]/exercise/_sections/header'
import { type Metadata } from 'next'
import { Suspense } from 'react'
import {
	ExerciseMetricsSkeleton,
	HeaderSkeleton
} from './_components/skeletons'
import { ExerciseMetrics } from './_components/exercise-metrics'
import { connection } from 'next/server'
import Footer from '~/components/layout/footer'
import { i18n, type Locale } from '~/i18n-config'
import { ExerciseDialogGate } from '~/app/[lang]/dashboard/_components/exercise/exercise-dialog-gate'
import { AddExerciseButton } from '~/app/[lang]/dashboard/_components/exercise/add-exercise-button'

export const metadata: Metadata = {
	title: 'Exercise'
}

export default async function ExercisePage({
	params
}: {
	params: Promise<{ lang: Locale }>
}) {
	await connection()
	const { lang } = await params
	const locale = i18n.locales.includes(lang) ? lang : i18n.defaultLocale

	return (
		<section className='mx-auto min-h-screen w-full bg-background px-0 py-5 text-foreground'>
			<Suspense fallback={<HeaderSkeleton />}>
				<Header
					exerciseDialog={
						<Suspense fallback={<AddExerciseButton />}>
							<ExerciseDialogGate lang={locale} />
						</Suspense>
					}
				/>
			</Suspense>
			<Suspense fallback={<ExerciseMetricsSkeleton />}>
				<ExerciseMetrics lang={locale} />
			</Suspense>
			<Footer className='fixed bottom-0 right-0 backdrop-blur-none' showAbout />
		</section>
	)
}
