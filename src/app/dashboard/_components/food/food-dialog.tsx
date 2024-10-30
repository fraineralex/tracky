import { ClipboardList } from 'lucide-react'
import { Button } from '~/components/ui/button'
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

export default async function FoodDialog() {
	const user = await currentUser()
	if (!user) return null
	const foodData = await db
		.select()
		.from(food)
		.where(or(isNull(food.userId), eq(food.userId, user?.id)))

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size='sm' className='flex-grow sm:flex-grow-0'>
					<ClipboardList className='mr-2 h-4 w-4' /> Add Meal
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-[95%] rounded-lg px-0 md:max-w-3xl lg:max-w-4xl lg:px-5 xl:max-w-6xl'>
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
