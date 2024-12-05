'use client'

import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'
import { AboutMenuItem, Unit, Weights } from '~/types'
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
import { updatePublicMetadata } from '../_actions'
import { loadingToast } from '~/lib/loading-toast'
import { toast } from 'sonner'

const ICONS = {
	born: CalendarIcon,
	sex: User,
	activity: Activity,
	height: Ruler,
	weights: Weight,
	fat: Percent,
	goal: Flag,
	goalWeight: Weight,
	progress: Target
}

export function MenuItem({ name, label, attr }: AboutMenuItem) {
	const [isOpen, setIsOpen] = React.useState(false)
	const [value, setValue] = React.useState(attr.value)

	function formatHeight(height: number, unit: Unit | undefined) {
		if (unit === 'ft, in') {
			const feet = Math.floor(height)
			const inches = Math.round((height - feet) * 12)
			return `${feet}′${inches}"`
		}

		return `${height.toFixed(1)} ${unit}`
	}

	let displayValue = value.toString()
	if (attr.name === 'born')
		displayValue = format(new Date(`${value}T12:00`), 'PPP')
	if (attr.name === 'height')
		displayValue = formatHeight(value as number, attr.unit)
	if (attr.name === 'weights' || name === 'goalWeight')
		displayValue = `${value} ${attr.unit}`
	if (attr.name === 'fat' || name === 'progress') displayValue = `${value}%`

	const Icon = ICONS[name as keyof typeof ICONS]

	const updateValue = async (newValue: typeof value) => {
		setIsOpen(false)
		setValue(newValue)
		const dismiss = loadingToast(`Updating your ${label}...`, 'update-metadata')

		let result
		if (attr.name !== 'weights') {
			result = await updatePublicMetadata({ [attr.name]: newValue })
		} else {
			const weights: Weights = [
				{
					value: newValue as number,
					date: new Date().toISOString().split('T')[0]!,
					unit: 'kg'
				}
			]

			result = await updatePublicMetadata({ weights })
		}
		dismiss()
		if (!result.success) {
			toast.error(`Error updating your ${label}, please try again later.`)
			return
		}

		toast.success(`Your ${label} has been updated successfully.`)
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
						<p
							className={`truncate text-xs tracking-tighter text-muted-foreground sm:text-sm sm:tracking-normal ${!attr.unit ? 'capitalize' : ''}`}
						>
							{displayValue}
						</p>
					</div>
				</Button>
			</DialogTrigger>
			<DialogContent
				aria-describedby={label}
				className='max-w-[95%] rounded-lg sm:max-w-96 md:max-w-128'
			>
				<DialogHeader>
					<DialogTitle>
						{label} {attr.unit && `(${attr.unit})`}
					</DialogTitle>
				</DialogHeader>
				<SettingsField attr={{ ...attr, value, updateValue }} />
			</DialogContent>
		</Dialog>
	)
}
