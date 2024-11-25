import FoodDialog from '~/app/dashboard/_components/food/food-dialog'
import RegisterFoodDialog from '../_components/register-food-dialog'
import AIChatDialog from '../_components/ai-chat-dialog'
import { logMealAI } from '../_actions'

export function Header() {
	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	})

	return (
		<div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
			<h1 className='hidden text-2xl font-bold uppercase sm:block'>{today}</h1>
			<div className='flex w-full flex-wrap items-center gap-2 sm:w-auto place-content-center place-items-center'>
				<RegisterFoodDialog />
				<FoodDialog />
				<AIChatDialog
					action={logMealAI}
					placeholder='Log 100 g of chicken breast for lunch'
					title='Chat with AI'
					description='Tell the AI about your meals, and it will log them for you.'
					instruction='Please specify the food item, portion size, and meal group.'
				/>
			</div>
		</div>
	)
}
