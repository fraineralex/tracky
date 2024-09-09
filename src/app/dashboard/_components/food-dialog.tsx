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
import { columns } from './food/columns'
import { db } from '~/server/db'
import { food } from '~/server/db/schema'

export default async function FoodDialog() {
	const data = await db.select().from(food)
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='default' className='font-medium'>
					<Plus className='me-2' />
					Add Food
				</Button>
			</DialogTrigger>
			<DialogContent className='h-[80%] sm:max-w-6xl'>
				<DialogHeader>
					<DialogTitle className='ps-8 pt-2'>Add Food to Diary</DialogTitle>
				</DialogHeader>

				<div className='container mx-auto'>
					<DataTable columns={columns} data={data} />
				</div>
			</DialogContent>
		</Dialog>
	)
}
