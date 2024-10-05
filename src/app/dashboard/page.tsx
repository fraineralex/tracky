import FoodDialog from './_components/food/food-dialog'
import ExerciseDialog from './_components/exercise/exercise-dialog'
import NutritionGraphic from './_sections/nutrition-graphic'
import InsightsAndAnalitics from './_sections/insights-analytics'
import DataAndHabits from './_sections/data-habits'
import { currentUser } from '@clerk/nextjs/server'
import { PublicMetadata } from '~/types'
import { getUserNutritionMetrics } from '~/server/utils/nutrition'

export default async function DashboardPage() {
	const user = await currentUser()
	if (!user) return null
	const userMetadata = user.publicMetadata as PublicMetadata
	const nutritionMeatrics = await getUserNutritionMetrics(user.id, userMetadata)
	const expenditure = nutritionMeatrics[0]?.calories.needed ?? 0

	const todayLong = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	})

	const todayShort = new Date().toLocaleDateString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric'
	})

	return (
		<section className='h-full w-full overflow-auto pt-5 -mb-8 sm:mb-0 sm:pb-5 xl:ms-5 xl:px-5'>
			<div className='flex justify-between'>
				<h1 className='mb-3 text-xl font-semibold uppercase'>
					<span className='hidden md:inline'>{todayLong}</span>
					<span className='md:hidden'>{todayShort}</span>
				</h1>

				<header className='float-end flex space-x-5'>
					<FoodDialog />
					<ExerciseDialog />
				</header>
			</div>
			<div className='flex-col space-x-3 space-y-3 mt-4 sm:mt-0  md:flex-row lg:flex lg:justify-between md:pt-2'>
				<NutritionGraphic nutritionMetrics={nutritionMeatrics} />
				<InsightsAndAnalitics expenditure={expenditure} {...userMetadata} />
			</div>
			<DataAndHabits userMetadata={userMetadata} expenditure={expenditure} />
		</section>
	)
}
