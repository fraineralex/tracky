'use cache'

import { Dumbbell } from 'lucide-react'
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
import { unstable_cacheLife as cacheLife } from 'next/cache'

export default async function ExerciseDialog() {
	cacheLife('max')
	const categories = await db.select().from(exerciseCategory)

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size='sm' className='flex-grow sm:flex-grow-0'>
					<Dumbbell className='mr-2 h-4 w-4' /> Add Exercise
				</Button>
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
