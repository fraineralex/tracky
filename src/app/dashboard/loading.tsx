import { Skeleton } from '~/components/ui/skeleton'
import { DashboardDataSkeleton } from './_components/skeletons'

export default function Loading() {
	return (
		<section className='h-full w-full overflow-auto pt-5 sm:mb-0 sm:pb-5'>
			<div className='flex flex-wrap-reverse gap-x-2 gap-y-2 md:justify-between'>
				<h1 className='order-last h-full w-full text-center align-bottom uppercase md:order-first md:h-fit md:w-fit'>
					<Skeleton className='mx-auto h-8 w-72 md:mx-0 md:w-80' />
				</h1>

				<header className='contents md:float-end md:flex md:space-x-5'>
					<Skeleton className='mx-auto h-9 w-40 md:w-28' />
					<Skeleton className='mx-auto h-9 w-40 md:w-32' />
				</header>
			</div>
			<DashboardDataSkeleton />
		</section>
	)
}
