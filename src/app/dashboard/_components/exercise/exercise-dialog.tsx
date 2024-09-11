import { Plus } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'

import ExerciseCategories from './exercise-categories'

export default function ExerciseDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='default' className='font-medium'>
					<Plus className='me-2' />
					Add Exercise
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-3xl'>
				<DialogHeader className='px-5'>
					<DialogTitle>Register Exercise</DialogTitle>
				</DialogHeader>
				<ExerciseCategories />
			</DialogContent>
		</Dialog>
	)
}
