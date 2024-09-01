'use client'

import { ColumnDef } from '@tanstack/react-table'
import { PlusCircle } from 'lucide-react'
import { Button } from '~/components/ui/button'

export type Food = {
	id: string
	name: string
	protein: number
	kcal: number
	fat: number
	carbs: number
	servingSize: number
}

export const columns: ColumnDef<Food>[] = [
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'protein',
		header: 'Protein',
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
		header: 'Net Carbs',
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
		header: 'Kilocalories',
		cell: ({ row }) => {
			const kcal = parseFloat(row.getValue('kcal'))
			const formatted = `${kcal} kcal`

			return <div className='text-left'>{formatted}</div>
		}
	},
	{
		accessorKey: 'servingSize',
		header: 'Serving Size',
		cell: ({ row }) => {
			const servingSize = parseFloat(row.getValue('servingSize'))
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'unit',
				unit: 'gram'
			}).format(servingSize)

			return <div className='text-left '>{formatted}</div>
		}
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return (
				<Button variant='ghost' className='h-8 w-8 p-0'>
					<span className='sr-only'>Open Food Details</span>
					<PlusCircle className='h-4 w-4' />
				</Button>
			)
		}
	}
]
