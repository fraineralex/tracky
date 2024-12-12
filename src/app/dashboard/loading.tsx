import { Skeleton } from '~/components/ui/skeleton'

export default function Loading() {
	return (
		<section className='h-full w-full overflow-auto pt-5 sm:mb-0 sm:pb-5'>
			<div>
				<div className='flex flex-wrap-reverse gap-x-2 gap-y-2 md:justify-between'>
					<h1 className='order-last h-full w-full text-center align-bottom text-2xl font-bold uppercase md:order-first md:h-fit md:w-fit'>
						<Skeleton className='mx-auto h-8 w-64 md:mx-0 md:w-80' />
					</h1>

					<header className='contents md:float-end md:flex md:space-x-5'>
						<Skeleton className='mx-auto h-9 w-40 md:w-28' />
						<Skeleton className='mx-auto h-9 w-40 md:w-32' />
					</header>
				</div>
				<div className='flex-col pt-4 sm:mt-0 md:flex-row lg:flex lg:justify-between'>
					<Skeleton className='mx-auto h-[374px] w-full rounded-lg md:mx-0 lg:max-w-96 xl:max-w-[490px]' />
					<div className='pt-3 lg:pt-0'>
						<aside className='mx-auto space-y-3 md:mx-0 lg:w-full'>
							<div className='flex space-x-3 lg:w-full'>
								<Skeleton className='h-[190px] w-full lg:w-[235px]' />
								<Skeleton className='h-[190px] w-full lg:w-[235px]' />
							</div>
							<Skeleton className='h-[173px] w-full' />
						</aside>
					</div>
				</div>
				<section className='mx-auto grid w-full grid-cols-2 gap-3 pt-3 sm:max-w-[460px] md:flex md:max-w-full md:gap-0 md:space-x-2 lg:justify-between'>
					<Skeleton className='h-[158px] w-full' />
					<Skeleton className='h-[158px] w-full' />
					<Skeleton className='h-[158px] w-[343px] lg:w-full' />
				</section>
			</div>
		</section>
	)
}
