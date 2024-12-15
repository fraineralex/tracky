import { Skeleton } from '~/components/ui/skeleton'

export function NutritionGraphicSkeleton() {
	return (
		<Skeleton className='mx-auto h-[374px] w-full rounded-lg md:mx-0 lg:max-w-96 xl:max-w-[490px]' />
	)
}

export function InsightsAndAnaliticsSkeleton() {
	return (
		<div className='pt-3 lg:pt-0'>
			<aside className='mx-auto space-y-3 md:mx-0 lg:w-full'>
				<div className='flex space-x-3 lg:w-full'>
					<Skeleton className='h-[190px] w-full lg:w-[235px]' />
					<Skeleton className='h-[190px] w-full lg:w-[235px]' />
				</div>
				<Skeleton className='h-[173px] w-full' />
			</aside>
		</div>
	)
}

export function DataAndHabitsSkeleton() {
	return (
		<div className='mx-auto grid w-full grid-cols-2 gap-3 pt-3 sm:max-w-[460px] md:flex md:max-w-full md:gap-0 md:space-x-2 lg:justify-between'>
			<Skeleton className='h-[158px] w-full' />
			<Skeleton className='h-[158px] w-full' />
			<Skeleton className='h-[158px] w-[343px] lg:w-full' />
		</div>
	)
}

export function DashboardDataSkeleton() {
	return (
		<>
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
			<div className='mx-auto grid w-full grid-cols-2 gap-3 pt-3 sm:max-w-[460px] md:flex md:max-w-full md:gap-0 md:space-x-2 lg:justify-between'>
				<Skeleton className='h-[158px] w-full' />
				<Skeleton className='h-[158px] w-full' />
				<Skeleton className='h-[158px] w-[343px] lg:w-full' />
			</div>
		</>
	)
}
