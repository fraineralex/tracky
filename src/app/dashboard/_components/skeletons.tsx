import { Skeleton } from '~/components/ui/skeleton'

export function NutritionGraphicSkeleton() {
	return (
		<div className='mx-auto w-full pb-3 lg:pb-0'>
			<Skeleton
				className={`h-[350px] w-full rounded-lg lg:h-full lg:max-w-96 xl:max-w-[490px]`}
			/>
		</div>
	)
}

export function InsightsAndAnaliticsSkeleton() {
	return (
		<aside className='mx-auto md:mx-0 lg:w-full'>
			<div className='flex space-x-3 lg:w-full'>
				<Skeleton className='h-[190.19px] w-full lg:w-[235.5px]' />
				<Skeleton className='h-[190.19px] w-full lg:w-[235.5px]' />
			</div>
			<Skeleton className='mt-3 h-[174.19px] lg:w-full' />
		</aside>
	)
}

export function DataAndHabitsSkeleton() {
	return (
		<div className='mx-auto grid w-full grid-cols-2 gap-3 pt-3 sm:max-w-[460px] md:flex md:max-w-full md:gap-0 md:space-x-2 lg:justify-between'>
			<Skeleton className='h-[158px] w-full' />
			<Skeleton className='h-[158px] w-full' />
			<Skeleton className='col-span-2 h-[158px] md:col-span-1 md:w-full' />
		</div>
	)
}

export function DashboardDataSkeleton() {
	return (
		<>
			<div className='mt-4 flex-col sm:mt-0 md:flex-row md:pt-3 lg:flex lg:justify-between gap-x-3'>
				<NutritionGraphicSkeleton />
				<InsightsAndAnaliticsSkeleton />
			</div>
			<DataAndHabitsSkeleton />
		</>
	)
}
