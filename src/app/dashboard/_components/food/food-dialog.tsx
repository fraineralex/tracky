import { ClipboardList, Plus } from 'lucide-react'
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

export default async function FoodDialog() {
	const foodData = await db.select().from(food)

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size='sm' className='flex-grow sm:flex-grow-0'>
					<ClipboardList className='mr-2 h-4 w-4' /> Add Meal
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-lg px-0 sm:max-w-xl md:max-w-3xl lg:max-w-5xl lg:px-5 xl:max-w-6xl'>
				<DialogHeader>
					<DialogTitle className='ps-8 pt-2'>Add Meal to Diary</DialogTitle>
				</DialogHeader>

				<div className='container mx-auto'>
					<DataTable columns={columns} data={foodData} />
				</div>
			</DialogContent>
		</Dialog>
	)
}
