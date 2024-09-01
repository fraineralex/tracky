import { Plus } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { DataTable } from '~/components/ui/data-table'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'
import { columns, Food } from './food/columns'

async function getData(): Promise<Food[]> {
	const data = await fetch('http://localhost:3000/food.json')
	return await data.json()
}

export default async function FoodDialog() {
	const data = await getData()
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='secondary'
					className='bg-slate-300 font-medium hover:bg-slate-300/80 dark:bg-slate-800 dark:hover:bg-slate-800/80'
				>
					<Plus className='me-2' />
					Register Food
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-6xl h-[90%] my-auto'>
				<DialogHeader>
					<DialogTitle className='ps-8'>Register Food</DialogTitle>
				</DialogHeader>

				<div className='container mx-auto py-5'>
					<DataTable columns={columns} data={data} />
				</div>

				<DialogFooter className='pe-7'>
					<Button type='submit'>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
