'use cache'

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
import { unstable_cacheLife as cacheLife } from 'next/cache'
import { AddExerciseButton } from './add-exercise-button'

export default async function ExerciseDialog() {
	cacheLife('max')
	const categories = await db.select().from(exerciseCategory)

	return (
		<Dialog>
			<DialogTrigger asChild>
				<AddExerciseButton />
			</DialogTrigger>
			<DialogContent className='max-w-[95%] rounded-lg px-3 md:max-w-3xl md:px-5'>
				<DialogHeader className='text-start md:px-5'>
					<DialogTitle>Register Exercise</DialogTitle>
				</DialogHeader>
				<ExerciseCategories categories={categories} />
			</DialogContent>
		</Dialog>
	)
}
