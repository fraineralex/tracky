import { Button } from '~/components/ui/button'
import { MessageSquare } from 'lucide-react'
import FoodDialog from '~/app/dashboard/_components/food/food-dialog'
import RegisterFoodDialog from '../_components/register-food-dialog'

export function Header() {
	return (
		<div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
			<h1 className='sm:block hidden text-3xl font-bold'>Food Tracker</h1>
			<div className='flex w-full flex-wrap items-center gap-2 sm:w-auto'>
				<RegisterFoodDialog />
				<FoodDialog />
				<Button size='sm' className='flex-grow sm:flex-grow-0'>
					<MessageSquare className='mr-2 h-4 w-4' /> AI Chat
				</Button>
			</div>
		</div>
	)
}
