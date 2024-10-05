import { Dumbbell, Plus } from 'lucide-react'
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
				<Button size='sm' className='flex-grow sm:flex-grow-0'>
					<Dumbbell className='mr-2 h-4 w-4' /> Add Exercise
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
