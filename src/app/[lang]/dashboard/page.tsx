import FoodDialog from './_components/food/food-dialog'
import { ExerciseDialogGate } from './_components/exercise/exercise-dialog-gate'
import { type Metadata } from 'next'
import Footer from '~/components/layout/footer'
import { Suspense } from 'react'
import { DashboardDataSkeleton } from './_components/skeletons'
import { AddMealButton } from './_components/food/add-meal-button'
import { DashboardData } from './_components/dashboard-data'
import { connection } from 'next/server'
import AIChatDialog from '../food/_components/ai-chat-dialog'
import { describeEntryImage, logHealthAI } from '~/app/ai/_actions'
import { getDictionary } from '~/get-dictionary'
import { i18n, type Locale } from '~/i18n-config'

export const metadata: Metadata = {
	title: 'Dashboard'
}

export default async function DashboardPage({
	params
}: {
	params: Promise<{ lang: Locale }>
}) {
	await connection()
	const { lang } = await params
	const locale = i18n.locales.includes(lang) ? lang : i18n.defaultLocale
	const dictionary = await getDictionary(locale)

	const today = new Date().toLocaleDateString(
		locale === 'es' ? 'es-ES' : 'en-US',
		{
			weekday: 'long',
			month: 'long',
			day: 'numeric'
		}
	)

	return (
		<section className='h-full w-full overflow-auto pt-5 sm:mb-0 sm:pb-5'>
			<div className='flex flex-wrap-reverse gap-x-2 gap-y-2 pb-2 md:justify-between'>
				<h1 className='order-last h-full w-full text-center align-bottom text-2xl font-bold uppercase md:order-first md:h-fit md:w-fit'>
					{today}
				</h1>
				<header className='contents md:float-end md:flex md:space-x-5'>
					<AIChatDialog
						action={logHealthAI}
						placeholder={dictionary.dashboard.aiChatPlaceholder}
						title={dictionary.dashboard.chatWithAI}
						instruction={dictionary.dashboard.aiChatInstruction}
						describeImage={describeEntryImage}
					/>
					<Suspense fallback={<AddMealButton />}>
						<FoodDialog lang={locale} />
					</Suspense>
					<Suspense fallback={<AddMealButton />}>
						<ExerciseDialogGate lang={locale} />
					</Suspense>
				</header>
			</div>
			<Suspense fallback={<DashboardDataSkeleton />}>
				<DashboardData lang={locale} />
			</Suspense>
			<Footer className='fixed bottom-2 right-0 backdrop-blur-none' showAbout />
		</section>
	)
}
