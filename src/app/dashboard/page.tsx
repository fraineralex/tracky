import FoodDialog from './_components/food/food-dialog'
import ExerciseDialog from './_components/exercise/exercise-dialog'
import NutritionGraphic from './_sections/nutrition-graphic'
import InsightsAndAnalitics from './_sections/insights-analytics'
import DataAndHabits from './_sections/data-habits'
import { currentUser } from '@clerk/nextjs/server'
import { PublicMetadata } from '~/types'
import { getUserNutritionMetrics } from '~/server/utils/nutrition'
import { Metadata } from 'next'
import Footer from '~/components/layout/footer'

export const metadata: Metadata = {
	title: 'Dashboard'
}

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

	return (
		<>
			<section className='h-full w-full overflow-auto pt-5 sm:mb-0 sm:pb-5 xl:ms-5 xl:px-5'>
				<div className='flex flex-wrap-reverse gap-x-2 gap-y-2 pb-2 md:justify-between'>
					<h1 className='order-last h-full w-full text-center align-bottom text-xl font-semibold uppercase md:order-first md:h-fit md:w-fit'>
						{todayLong}
					</h1>

					<header className='contents md:float-end md:flex md:space-x-5'>
						<FoodDialog />
						<ExerciseDialog />
					</header>
				</div>
				<div className='mt-4 flex-col space-x-3 space-y-3 sm:mt-0  md:flex-row md:pt-2 lg:flex lg:justify-between'>
					<NutritionGraphic nutritionMetrics={nutritionMeatrics} />
					<InsightsAndAnalitics expenditure={expenditure} {...userMetadata} />
				</div>
				<DataAndHabits userMetadata={userMetadata} expenditure={expenditure} />
			</section>
			<Footer className='hidden sm:fixed bottom-0 -left-4 sm:block w-full py-3 backdrop-blur-none' />
		</>
	)
}
