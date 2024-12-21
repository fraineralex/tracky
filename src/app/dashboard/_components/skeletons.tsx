import { Skeleton } from '~/components/ui/skeleton'

export function NutritionGraphicSkeleton() {
	return (
		<div className='w-full'>
			<Skeleton
				className={`mx-auto h-full w-full rounded-lg md:mx-0 lg:max-w-96 xl:max-w-[490px]`}
			/>
		</div>
	)
}

export function InsightsAndAnaliticsSkeleton() {
	return (
		<aside className='mx-auto md:mx-0 lg:w-full'>
			<div className='flex space-x-3 lg:w-full'>
				<Skeleton className='-mt-3 h-[190.19px] w-full lg:w-[235.5px]' />
				<Skeleton className='-mt-3 h-[190.19px] w-full lg:w-[235.5px]' />
			</div>
			<Skeleton className='mt-3 h-[174.19px] w-full' />
		</aside>
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
			<div className='mt-4 flex-col space-x-3 space-y-3 sm:mt-0 md:flex-row md:pt-2 lg:flex lg:justify-between'>
				<NutritionGraphicSkeleton />
				<InsightsAndAnaliticsSkeleton />
			</div>
			<DataAndHabitsSkeleton />
		</>
	)
}
