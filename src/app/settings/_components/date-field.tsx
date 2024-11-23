import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'
import { SettingsAttr } from '~/types'

export function DateField({ attr }: { attr: SettingsAttr }) {
	const [newDate, setNewDate] = React.useState(attr.value as Date)

	const handleSelect = (date: Date | undefined) => {
		if (date) setNewDate(date)
	}

	return (
		<>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={'outline'}
						className={cn(
							'w-full pl-3 text-left font-normal',
							!attr.value && 'text-muted-foreground'
						)}
					>
						{attr.value ? format(attr.value, 'PPP') : <span>Pick a date</span>}
						<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className='w-auto p-0'
					align='start'
					aria-describedby='calendar'
				>
					<Calendar
						mode='single'
						selected={newDate}
						disabled={{
							before: new Date('1924-01-01'),
							after: new Date()
						}}
						initialFocus
						onSelect={handleSelect}
						defaultMonth={(attr.value as Date) || new Date('2000-01-31')}
					/>
				</PopoverContent>
			</Popover>
			<Button
				type='submit'
				onClick={() => attr.updateValue?.(newDate)}
				disabled={newDate === attr.value}
			>
				Save Changes
			</Button>
		</>
	)
}
