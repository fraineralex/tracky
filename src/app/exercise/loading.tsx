import { Skeleton } from '~/components/ui/skeleton'

export default function Loading() {
	return (
		<section className='mx-auto min-h-screen w-full px-0 md:py-5'>
			<header className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
				<div className='flex w-full flex-wrap place-content-center place-items-center items-center gap-2 sm:w-auto'>
					<h1 className='hidden text-2xl font-bold uppercase sm:block'>
						<Skeleton className='mx-auto h-9 w-52 md:mx-0 lg:w-72' />
					</h1>
				</div>
				<div className='flex w-full flex-wrap place-content-center place-items-center items-center gap-2 sm:w-auto'>
					<Skeleton className='mx-auto h-9 w-40 md:w-32' />
					<Skeleton className='mx-auto h-9 w-40 md:w-[88px]' />
				</div>
			</header>
			<div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Skeleton className='h-[110px] w-full rounded-xl lg:w-[228px]' />
				<Skeleton className='h-[110px] w-full rounded-xl lg:w-[228px]' />
				<Skeleton className='h-[110px] w-full rounded-xl lg:w-[228px]' />
				<Skeleton className='h-[110px] w-full rounded-xl lg:w-[228px]' />
			</div>
			<div>
				<Skeleton className='h-16 w-full rounded-lg md:h-[36px] lg:w-[562px]' />
				<Skeleton className='mt-4 h-[452px] w-full rounded-xl lg:w-[985px]' />
			</div>
		</section>
	)
}
