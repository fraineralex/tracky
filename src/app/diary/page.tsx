import { Metadata } from 'next'
import { Suspense } from 'react'
import { DiaryTimelineSkeletonUI } from './_components/skeletons'
import { DiaryTimelineData } from './_components/diary-timeline-data'
import { connection } from 'next/server'

export const metadata: Metadata = {
	title: 'Food'
}

export default async function DiaryPage() {
	await connection()
	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	})

	return (
		<section className='mx-auto min-h-screen w-full'>
			<div className='container mx-auto max-w-5xl px-4 py-8'>
				<h1 className='pb-4 text-2xl font-bold uppercase'>{today}</h1>
				<Suspense fallback={<DiaryTimelineSkeletonUI />}>
					<DiaryTimelineData />
				</Suspense>
			</div>
		</section>
	)
}
