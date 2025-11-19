import FoodDialog from '~/app/dashboard/_components/food/food-dialog'
import RegisterFoodDialog from '../_components/register-food-dialog'
import AIChatDialog from '../_components/ai-chat-dialog'
import { describeEntryImage, logHealthAI } from '~/app/ai/_actions'
import { Suspense } from 'react'
import { AddMealButton } from '~/app/dashboard/_components/food/add-meal-button'

export function Header() {
	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	})

	return (
		<div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
			<h1 className='hidden text-2xl font-bold uppercase sm:block'>{today}</h1>
			<div className='flex w-full flex-wrap place-content-center place-items-center items-center gap-2 sm:w-auto'>
				<RegisterFoodDialog />
				<Suspense fallback={<AddMealButton />}>
					<FoodDialog />
				</Suspense>
				<AIChatDialog
					action={logHealthAI}
					placeholder='Log 100 g of chicken breast for lunch'
					title='Chat with AI'
					instruction='Please specify the food item, portion size, and meal group.'
					describeImage={describeEntryImage}
				/>
			</div>
		</div>
	)
}
