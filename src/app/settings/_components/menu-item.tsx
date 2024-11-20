'use client'

import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'
import { AboutMenuItem } from '~/types'
import { SettingsField } from './settings-field'
import React from 'react'
import { format } from 'date-fns'
import {
	Activity,
	CalendarIcon,
	Flag,
	Percent,
	Ruler,
	Target,
	User,
	Weight
} from 'lucide-react'

const ICONS = {
	birthday: CalendarIcon,
	sex: User,
	activity: Activity,
	height: Ruler,
	weight: Weight,
	fat: Percent,
	goal: Flag,
	goalweight: Weight,
	progress: Target
}

export function MenuItem({ name, label, attr }: AboutMenuItem) {
	const [isOpen, setIsOpen] = React.useState(false)
	const [value, setValue] = React.useState(attr.value)

	const formatHeight = (height: number) => {
		const feet = Math.floor(height)
		const inches = Math.round((height - feet) * 12)
		return `${feet}′${inches}"`
	}

	let displayValue = value.toString()
	if (attr.name === 'birthday')
		displayValue = format(new Date(`${value}T12:00`), 'PPP')
	if (attr.name === 'height') displayValue = formatHeight(value as number)
	if (attr.name === 'weight' || name === 'goalweight')
		displayValue = `${value} kg`
	if (attr.name === 'fat' || name === 'progress') displayValue = `${value}%`

	const Icon = ICONS[name as keyof typeof ICONS]

	const updateValue = (newValue: typeof value) => {
		setIsOpen(false)
		setValue(newValue)
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					className='h-auto w-full justify-start px-4 py-4'
					onClick={() => setIsOpen(true)}
				>
					<Icon className='mr-2 h-5 w-5' />
					<div className='flex flex-col items-start'>
						<span className='font-medium'>{label}</span>
						<span className='text-sm capitalize text-muted-foreground'>
							{displayValue}
						</span>
					</div>
				</Button>
			</DialogTrigger>
			<DialogContent aria-describedby={label}>
				<DialogHeader>
					<DialogTitle>{label}</DialogTitle>
				</DialogHeader>
				<SettingsField attr={{ ...attr, value, updateValue }} />
			</DialogContent>
		</Dialog>
	)
}
