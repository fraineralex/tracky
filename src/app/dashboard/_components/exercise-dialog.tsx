import { Plus } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'

export default function ExerciseDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='default' className='font-medium'>
					<Plus className='me-2' />
					Add Exercise
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Register Exercise</DialogTitle>
				</DialogHeader>
				<div className='grid gap-4 py-4'>...</div>
				<DialogFooter>
					<Button type='submit'>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
