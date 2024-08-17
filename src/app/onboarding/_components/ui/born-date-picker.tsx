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

export function BornDatePicker({
	date,
	setDate,
	showSection
}: {
	date: Date | undefined
	setDate: (date: Date | undefined) => void
	showSection: boolean
}) {
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
					className={`w-auto p-0  ${showSection ? 'visible' : 'invisible'}`}
					align='center'
				>
					<Calendar
						mode='single'
						selected={date}
						onSelect={setDate}
						initialFocus
						disabled={{
							before: new Date('1924-01-01'),
							after: new Date('2016-01-01')
						}}
						defaultMonth={date || new Date('2000-01-31')}
					/>
				</PopoverContent>
			</Popover>
			<Label className='mt-2 text-xs text-gray-600'>
				Your date of birth is used to calculate your age.
			</Label>
		</>
	)
}
