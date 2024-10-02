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
import { db } from '~/server/db'
import { exerciseCategory } from '~/server/db/schema'

export default async function ExerciseDialog() {
	const categories = await db.select().from(exerciseCategory)
	
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='default' className='font-medium'>
					<Plus className='me-2' />
					Add Exercise
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-lg sm:max-w-xl md:max-w-3xl'>
				<DialogHeader className='px-5'>
					<DialogTitle>Register Exercise</DialogTitle>
				</DialogHeader>
				<ExerciseCategories categories={categories} />
			</DialogContent>
		</Dialog>
	)
}
