import { Skeleton } from '~/components/ui/skeleton'

export default function Loading() {
	return (
		<section className='container mx-auto'>
			<header className='mt-5 flex flex-col'>
				<Skeleton className='h-7 w-28' />
				<Skeleton className='mt-2 h-5 w-64' />
			</header>
			<div className='mt-10'>
				<Skeleton className='h-6 w-[185px]' />
				<div className='mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3'>
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton className='h-[74px] w-full rounded-lg' key={i} />
					))}
				</div>
			</div>
			<div className='mt-5 lg:mt-10'>
				<Skeleton className='h-6 w-[195px]' />
				<div className='mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3'>
					{Array.from({ length: 3 }).map((_, i) => (
						<Skeleton className='h-[74px] w-full rounded-lg' key={i} />
					))}
				</div>
			</div>
			<div className='mt-5 lg:mt-10'>
				<Skeleton className='h-6 w-[212px]' />
				<div className='mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3'>
					{Array.from({ length: 3 }).map((_, i) => (
						<Skeleton className='h-[74px] w-full rounded-lg' key={i} />
					))}
				</div>
			</div>
			<Skeleton className='mx-auto mt-8 h-5 w-32' />
		</section>
	)
}
