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
