import FoodDialog from './_components/food-dialog'
import ExerciseDialog from './_components/exercise-dialog'
import NutritionGraphic from './_sections/nutrition-graphic'
import InsightsAndAnalitics from './_sections/insights-analytics'

export default function DashboardPage() {
	return (
		<section className='w-full ps-5 pt-16'>
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
				<NutritionGraphic />
				<InsightsAndAnalitics />
			</div>
		</section>
	)
}
