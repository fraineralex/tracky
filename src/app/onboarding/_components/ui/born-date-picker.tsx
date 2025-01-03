'use strict'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '~/components/ui/popover'
import { Label } from '../../../../components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'

export function BornDatePicker({
	date,
	setDate,
	showSection
}: {
	date: Date
	setDate: (date: Date | undefined) => void
	showSection: boolean
}) {
	const currentYear = new Date().getFullYear() - 10
	const years = Array.from({ length: 56 }, (_, i) => currentYear - i)
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	]
	const days = Array.from({ length: 31 }, (_, i) => i + 1)

	return (
		<>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={'outline'}
						className={cn(
							'w-[280px] justify-start text-left font-normal',
							!date && 'text-muted-foreground'
						)}
					>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{date ? format(date, 'PPP') : <span>Pick a date</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className={`flex w-auto flex-col space-y-2 p-2  ${showSection ? 'visible' : 'invisible'}`}
					align='start'
				>
					<div className='flex space-x-1'>
						<Select
							onValueChange={value =>
								setDate(
									new Date(Number(value), date.getMonth(), date.getDate())
								)
							}
						>
							<SelectTrigger>
								<SelectValue
									defaultValue={date.getFullYear()}
									placeholder={date.getFullYear()}
								/>
							</SelectTrigger>
							<SelectContent position='popper'>
								{years.map(year => (
									<SelectItem key={year} value={year.toString()}>
										{year}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							onValueChange={value =>
								setDate(
									new Date(date.getFullYear(), Number(value), date.getDate())
								)
							}
						>
							<SelectTrigger>
								<SelectValue
									defaultValue={date.getMonth()}
									placeholder={months[date.getMonth()]}
								/>
							</SelectTrigger>
							<SelectContent position='popper'>
								{months.map((month, index) => (
									<SelectItem key={index} value={index.toString()}>
										{month}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							onValueChange={value =>
								setDate(
									new Date(date.getFullYear(), date.getMonth(), Number(value))
								)
							}
						>
							<SelectTrigger>
								<SelectValue
									defaultValue={date.getDate()}
									placeholder={date.getDate()}
								/>
							</SelectTrigger>
							<SelectContent position='popper'>
								{days.map((day, index) => (
									<SelectItem key={index + 1} value={day.toString()}>
										{day}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='rounded-md border'>
						<Calendar
							mode='single'
							selected={date}
							onSelect={setDate}
							initialFocus
							disabled={{
								before: new Date(currentYear - 100, 0, 1),
								after: new Date()
							}}
							defaultMonth={date || new Date(currentYear - 25, 0, 1)}
						/>
					</div>
				</PopoverContent>
			</Popover>
			<Label className='mt-2 text-xs text-gray-600'>
				Your date of birth is used to calculate your age.
			</Label>
		</>
	)
}
