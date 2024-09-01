import { Plus } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'

export default function FoodDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='secondary'
					className='bg-slate-300 font-medium hover:bg-slate-300/80 dark:bg-slate-800 dark:hover:bg-slate-800/80'
				>
					<Plus className='me-2' />
					Register Food
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-6xl'>
				<DialogHeader>
					<DialogTitle>Register Food</DialogTitle>
				</DialogHeader>
				<div className='grid gap-4 py-4'>...</div>
				<DialogFooter>
					<Button type='submit'>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
