import { ClipboardList } from 'lucide-react'
import { Button } from '~/components/ui/button'

export function AddMealButton() {
	return (
		<Button size='sm' className='flex-grow sm:flex-grow-0'>
			<ClipboardList className='mr-2 h-4 w-4' /> Add Meal
		</Button>
	)
}
