'use client'

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
import { State } from '~/app/onboarding/_actions'

export function BornDatePicker({
	formState,
	date,
	setDate
}: {
	formState: State
	date: Date | undefined
	setDate: (date: Date | undefined) => void
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
				<PopoverContent className='w-auto p-0'>
					<Calendar
						mode='single'
						selected={date}
						onSelect={setDate}
						initialFocus
						disabled={{ before: new Date('1900-01-01'), after: new Date() }}
					/>
				</PopoverContent>
			</Popover>
			<Label className='mt-2 text-xs text-gray-600'>
				{formState.errors?.born ? (
					<div
						id='born-error'
						aria-live='polite'
						className='text-xs text-red-500'
					>
						{formState.errors.born.map((error: string) => (
							<p key={error}>{error}</p>
						))}
					</div>
				) : (
					'Your date of birth is used to calculate your age.'
				)}
			</Label>
		</>
	)
}
