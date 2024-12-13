import { Skeleton } from '~/components/ui/skeleton'

export default function Loading() {
	return (
		<section className='min-h-screen w-full'>
			<div className='container max-w-5xl px-4 py-8'>
				<Skeleton className='h-8 w-52 lg:w-64' />
				<div className='mt-4 space-y-8'>
					<div className='rounded-lg border p-6 shadow-lg'>
						<h2 className='mb-6 flex items-center'>
							<Skeleton className='mr-2 h-7 w-7' />
							<Skeleton className='h-7 w-20' />
						</h2>
						<div className='flex flex-wrap gap-6'>
							<div className='mt-2 flex-grow space-y-2'>
								<Skeleton className='h-5 w-28' />
								<div className='flex flex-wrap gap-2'>
									<Skeleton className='h-8 w-[52px]' />
									<Skeleton className='h-8 w-[72px]' />
									<Skeleton className='h-8 w-[52px]' />
								</div>
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-5 w-14' />
								<Skeleton className='h-[36px] w-[200px]' />
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-5 w-28' />
								<Skeleton className='h-[36px] w-[200px]' />
							</div>
						</div>
					</div>
					{Array.from({ length: 2 }).map((_, i) => (
						<div className='overflow-hidden rounded-lg shadow-md' key={i}>
							<div className='flex items-center px-6 py-4'>
								<div className='h-px flex-grow bg-primary/30'></div>
								<h3 className='px-4'>
									<Skeleton className='h-4 w-[174px] md:h-5' />
								</h3>
								<div className='h-px flex-grow bg-primary/30'></div>
							</div>
							<div className='divide-y'>
								{Array.from({ length: 2 }).map((_, i) => (
									<div className='px-4 py-4 sm:px-6' key={i}>
										<div className='flex flex-col items-start justify-between sm:flex-row sm:items-center'>
											<div className='mb-2 flex items-center sm:mb-0'>
												<div className='mr-3 flex-shrink-0'>
													<Skeleton className='h-9 w-9' />
												</div>
												<div>
													<Skeleton className='h-6 w-20' />
													<Skeleton className='mt-3 h-4 w-36 md:h-5' />
												</div>
											</div>
											<div className='flex items-center'>
												<Skeleton className='h-4 w-20 md:h-5 md:w-24' />
											</div>
										</div>
										<div className='mt-3 flex flex-wrap gap-2'>
											<Skeleton className='h-6 w-20 rounded-full' />
											<Skeleton className='h-6 w-20 rounded-full' />
											<Skeleton className='h-6 w-20 rounded-full' />
											<Skeleton className='h-6 w-20 rounded-full' />
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
