import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
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
				<PopoverContent className='w-auto p-0' align='start'>
					<Calendar
						mode='single'
						selected={attr.value as Date}
						disabled={date =>
							date > new Date() || date < new Date('1900-01-01')
						}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		</>
	)
}
