import FoodDialog from './_components/food/food-dialog'
import ExerciseDialog from './_components/exercise/exercise-dialog'
import NutritionGraphic from './_sections/nutrition-graphic'
import InsightsAndAnalitics from './_sections/insights-analytics'
import DataAndHabits from './_sections/data-habits'
import { calculateNutritionalNeeds } from '~/lib/utils'
import { currentUser } from '@clerk/nextjs/server'
import { PublicMetadata } from '~/types'
import { db } from '~/server/db'
import { consumption, food } from '~/server/db/schema'
import { eq, and, gte } from 'drizzle-orm'

export default async function DashboardPage() {
	const user = await currentUser()
	if (!user) return null
	const nutritionMeatrics = calculateNutritionalNeeds(
		user.publicMetadata as PublicMetadata
	)
	const result = await db
		.select()
		.from(consumption)
		.innerJoin(food, eq(consumption.foodId, food.id))
		.where(
			and(
				eq(consumption.userId, user.id),
				gte(consumption.createdAt, new Date())
			)
		)

	result.forEach(({ consumption, food }) => {
		const calories =
			(Number(consumption.portion) / Number(food.servingSize)) *
			Number(food.kcal)
		const protein =
			(Number(consumption.portion) / Number(food.servingSize)) *
			Number(food.protein)
		const carbs =
			(Number(consumption.portion) / Number(food.servingSize)) *
			Number(food.carbs)
		const fats =
			(Number(consumption.portion) / Number(food.servingSize)) *
			Number(food.fat)

		nutritionMeatrics.calories.consumed += calories
		nutritionMeatrics.protein.consumed += protein
		nutritionMeatrics.carbs.consumed += carbs
		nutritionMeatrics.fats.consumed += fats
		nutritionMeatrics.calories.remaining -= calories
		nutritionMeatrics.protein.remaining -= protein
		nutritionMeatrics.carbs.remaining -= carbs
		nutritionMeatrics.fats.remaining -= fats
	})

	return (
		<section className='ms-5 h-full w-full overflow-auto px-5 pb-10 pt-10'>
			<div className='flex justify-between'>
				<h1 className='mb-5 text-xl font-semibold uppercase'>
					{new Date().toLocaleDateString('en-US', {
						weekday: 'long',
						month: 'long',
						day: 'numeric'
					})}
				</h1>

				<header className='float-end flex space-x-5'>
					<FoodDialog />
					<ExerciseDialog />
				</header>
			</div>
			<div className='flex justify-between pt-5'>
				<NutritionGraphic {...nutritionMeatrics} />
				<InsightsAndAnalitics />
			</div>
			<DataAndHabits />
		</section>
	)
}
