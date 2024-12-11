import { DiaryTimeline } from './_components/diary-timeline'

export default function DiaryPage() {
	return (
		<section className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
			<div className='container mx-auto max-w-5xl px-4 py-8'>
				<DiaryTimeline />
			</div>
		</section>
	)
}
