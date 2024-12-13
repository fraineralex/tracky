import { Skeleton } from '~/components/ui/skeleton'

export default function Loading() {
	return (
		<section className='container mx-auto px-0 py-5'>
			<header className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
				<div className='flex w-full flex-wrap place-content-center place-items-center items-center gap-2 sm:w-auto'>
					<h1 className='hidden text-2xl font-bold uppercase sm:block'>
						<Skeleton className='mx-auto h-9 w-64 md:mx-0 md:w-24 lg:w-72' />
						<Skeleton className='mx-auto mt-2 block h-9 w-64 md:mx-0 md:w-44 lg:hidden' />
					</h1>
				</div>
				<div className='flex w-full flex-wrap place-content-center place-items-center items-center gap-2 sm:w-auto'>
					<Skeleton className='mx-auto h-9 w-[120px] md:-mr-5 md:w-32 lg:mr-0' />
					<Skeleton className='mx-auto h-9 w-[105px] md:w-28' />
					<Skeleton className='mx-auto h-9 w-24 md:w-24' />
				</div>
			</header>
			<div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Skeleton className='h-[152px] w-full rounded-xl lg:w-[234px]' />
				<Skeleton className='h-[152px] w-full rounded-xl lg:w-[234px]' />
				<Skeleton className='h-[152px] w-full rounded-xl lg:w-[234px]' />
				<Skeleton className='h-[152px] w-full rounded-xl lg:w-[234px]' />
			</div>
			<div>
				<Skeleton className='h-20 w-full rounded-lg md:h-14 lg:h-[36px] lg:w-[607px]' />
				<Skeleton className='mt-4 h-[452px] w-full rounded-xl lg:w-[985px]' />
			</div>
		</section>
	)
}
