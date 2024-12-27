import { DataTable } from '~/components/ui/data-table'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'
import { columns } from './columns'
import { db } from '~/server/db'
import { food } from '~/server/db/schema'
import { eq, isNull, or } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'
import { AddMealButton } from './add-meal-button'
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag
} from 'next/cache'

async function getFoodData(userId: string) {
	'use cache'
	cacheLife('max')
	cacheTag('food')
	return await db
		.select({
			id: food.id,
			name: food.name,
			protein: food.protein,
			kcal: food.kcal,
			fat: food.fat,
			carbs: food.carbs
		})
		.from(food)
		.where(or(isNull(food.userId), eq(food.userId, userId)))
}

export default async function FoodDialog() {
	const user = await currentUser()
	if (!user) return <AddMealButton />
	const foodData = await getFoodData(user.id)

	return (
		<Dialog>
			<DialogTrigger asChild>
				<AddMealButton />
			</DialogTrigger>
			<DialogContent className='min-w-80 max-w-[95%] rounded-lg px-0 md:max-w-3xl lg:max-w-4xl lg:px-5 xl:max-w-6xl'>
				<DialogHeader>
					<DialogTitle className='ps-4 pt-2 text-start md:ps-8'>
						Add Meal to Diary
					</DialogTitle>
				</DialogHeader>

				<div className='mx-auto px-2 md:container'>
					<DataTable columns={columns} data={foodData} />
				</div>
			</DialogContent>
		</Dialog>
	)
}
