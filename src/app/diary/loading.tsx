import { Skeleton } from '~/components/ui/skeleton'
import { DiaryTimelineSkeleton } from './_components/skeletons'

export default function Loading() {
	return (
		<section className='min-h-screen w-full'>
			<div className='container max-w-5xl px-4 py-8'>
				<Skeleton className='h-8 w-52 lg:w-64' />
				<DiaryTimelineSkeleton />
			</div>
		</section>
	)
}
