import NutritionGraphic from './sections/nutrition-graphics'
import { NutritionCards } from './sections/nutrition-cards'
import { Header } from './sections/header'

export default function FoodPage() {
	return (
		<div className='container mx-auto px-4 py-8'>
      <Header />
			<NutritionCards />
			<NutritionGraphic />
		</div>
	)
}
