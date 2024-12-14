import { Skeleton } from '~/components/ui/skeleton'

export default function Loading() {
	return (
		<section className='flex w-full flex-col place-content-center place-items-center'>
			<div className='mx-5 flex'>
				<div className='flex flex-col items-center space-y-10 text-center sm:mx-auto'>
					<Skeleton className='mt-5 h-8 w-28' />
					<article>
						<div className='flex flex-col space-y-10'>
							<Skeleton className='h-[28px] w-[280px] lg:h-9 lg:w-[382px]' />
							<div className='flex flex-col place-content-center items-center text-start'>
								<Skeleton className='h-9 w-[280]' />
								<Skeleton className='mt-2 h-4 w-[270]' />
							</div>
						</div>
					</article>
					<article>
						<div className='space-y-10 pt-5'>
							<Skeleton className='mx-auto h-[28px] w-[280px] lg:h-9 lg:w-[382px]' />
							<article className='grid w-full grid-cols-1 space-y-1 rounded-md md:grid-cols-2 md:space-x-1 md:space-y-0'>
								<Skeleton className='mx-auto h-[200px] w-[200px]' />
								<Skeleton className='mx-auto h-[200px] w-[200px]' />
							</article>
						</div>
					</article>
					<footer>
						<div className='flex w-full justify-end'>
							<Skeleton className='h-8 w-12' />
						</div>
					</footer>
				</div>
			</div>
		</section>
	)
}
