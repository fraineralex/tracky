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
import { cacheLife } from 'next/cache'
import { AddExerciseButton } from './add-exercise-button'
import { getDictionary } from '~/get-dictionary'
import { type Locale, i18n } from '~/i18n-config'
import { type ExerciseBody } from '~/types/profile'

async function getExerciseCategories() {
	'use cache'
	cacheLife('max')
	return db.select().from(exerciseCategory)
}

export default async function ExerciseDialog({
	lang,
	body
}: {
	lang?: Locale
	body: ExerciseBody | null
}) {
	const categories = await getExerciseCategories()
	const locale = lang && i18n.locales.includes(lang) ? lang : i18n.defaultLocale
	const dictionary = await getDictionary(locale)

	return (
		<Dialog>
			<DialogTrigger asChild>
				<AddExerciseButton />
			</DialogTrigger>
			<DialogContent className='rounded-lg px-3 md:max-w-3xl md:px-5'>
				<DialogHeader className='text-start md:px-5'>
					<DialogTitle>{dictionary.exercise.registerExercise}</DialogTitle>
				</DialogHeader>
				<ExerciseCategories categories={categories} body={body} />
			</DialogContent>
		</Dialog>
	)
}
