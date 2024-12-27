'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '~/components/ui/button'

export interface Food {
	id: string
	name: string
	protein: string
	kcal: string
	fat: string
	carbs: string
}

export const columns: ColumnDef<Food>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		enableHiding: false
	},
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Name
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		},
		enableHiding: false
	},
	{
		accessorKey: 'protein',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Protein
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		},
		cell: ({ row }) => {
			const protein = parseFloat(row.getValue('protein'))
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'unit',
				unit: 'gram'
			}).format(protein)

			return <div className='text-left '>{formatted}</div>
		}
	},
	{
		accessorKey: 'carbs',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Carbs
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		},
		cell: ({ row }) => {
			const carbs = parseFloat(row.getValue('carbs'))
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'unit',
				unit: 'gram'
			}).format(carbs)

			return <div className='text-left '>{formatted}</div>
		}
	},
	{
		accessorKey: 'fat',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Fat
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		},
		cell: ({ row }) => {
			const fat = parseFloat(row.getValue('fat'))
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'unit',
				unit: 'gram'
			}).format(fat)

			return <div className='text-left '>{formatted}</div>
		}
	},
	{
		accessorKey: 'kcal',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Calories
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		},
		cell: ({ row }) => {
			const kcal = parseFloat(row.getValue('kcal'))
			const formatted = `${kcal} kcal`

			return <div className='text-left'>{formatted}</div>
		}
	},
	{
		accessorKey: 'servingSize',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Serving Size
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		},
		cell: () => {
			return <div className='text-left '>100 g</div>
		}
	}
	/* {
		id: 'actions',
		cell: ({ row }) => {
			return (
				<Button
					variant='ghost'
					className='h-8 w-8 p-0 duration-300 ease-in-out hover:scale-125 hover:bg-transparent'
				>
					<span className='sr-only'>Open Food Details</span>
					<PlusCircle className='h-4 w-4' />
				</Button>
			)
		}
	} */
]
