import NutritionGraphic from './sections/nutrition-graphics'
import { NutritionCards } from './sections/nutrition-cards'
import { Header } from './sections/header'
import { currentUser } from '@clerk/nextjs/server'
import { NutritionMetrics } from '~/types'
import { getUserNutritionMetrics } from '~/server/utils/nutrition'
import { getAdjustedDay } from '~/lib/utils'
import { Metadata } from 'next'
import Footer from '~/components/layout/footer'

export const metadata: Metadata = {
	title: 'Food'
}

export default async function FoodPage() {
	const user = await currentUser()
	if (!user) return null
	const userMetadata = user.publicMetadata
	const nutritionMeatrics = await getUserNutritionMetrics(user.id, userMetadata)
	const today = getAdjustedDay(new Date())
	const todayNutrition = nutritionMeatrics[today] as NutritionMetrics

	return (
		<>
			<section className='container mx-auto px-0 py-5 lg:px-4 xl:ms-5'>
				<Header />
				<NutritionCards nutrition={todayNutrition} />
				<NutritionGraphic
					nutritionMeatrics={nutritionMeatrics}
					weightsChanges={userMetadata.weights}
				/>
			</section>
			<Footer className='-left-4 bottom-0 hidden w-full py-3 backdrop-blur-none sm:fixed sm:block' />
		</>
	)
}
