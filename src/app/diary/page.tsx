import { DiaryTimeline } from './_components/diary-timeline'

export default function DiaryPage() {
	return (
		<section className='mx-auto min-h-screen w-full'>
			<div className='container mx-auto max-w-5xl px-4 py-8'>
				<DiaryTimeline />
			</div>
		</section>
	)
}
