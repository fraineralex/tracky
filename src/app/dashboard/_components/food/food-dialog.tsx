import { Plus } from 'lucide-react'
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
				<Button variant='default' className='font-medium'>
					<Plus className='me-2' />
					Add Food
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-lg sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl px-0 lg:px-5'>
				<DialogHeader>
					<DialogTitle className='ps-8 pt-2'>Add Food to Diary</DialogTitle>
				</DialogHeader>

				<div className='container mx-auto'>
					<DataTable columns={columns} data={foodData} />
				</div>
			</DialogContent>
		</Dialog>
	)
}
