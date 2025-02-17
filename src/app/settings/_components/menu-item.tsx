'use client'

import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'
import { AboutMenuItem, Sex } from '~/types'
import { SettingsField } from './settings-field'
import React from 'react'
import { format } from 'date-fns'
import {
	Activity,
	Flag,
	Percent,
	Ruler,
	Target,
	User,
	Weight,
	Calendar
} from 'lucide-react'
import { updatePublicMetadata } from '../_actions'
import { loadingToast } from '~/lib/loading-toast'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { formatHeight } from '~/lib/utils'

const ICONS = {
	born: Calendar,
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
	const router = useRouter()

	let displayValue = value.toString()
	if (attr.name === 'born') displayValue = format(value, 'PP')
	if (attr.name === 'height') displayValue = formatHeight(value as number)
	if (attr.name === 'weights' || name === 'goalWeight')
		displayValue = `${value} kg`
	if (attr.name === 'fat' || name === 'progress') displayValue = `${value}%`

	const Icon = ICONS[name as keyof typeof ICONS]

	const updateValue = async (newValue: typeof value) => {
		setIsOpen(false)
		setValue(newValue)
		const dismiss = loadingToast(`Updating your ${label}...`, 'update-metadata')

		let result
		if (attr.name === 'sex') {
			result = await updatePublicMetadata({ sex: newValue as Sex })
		}

		if (attr.name === 'born') {
			result = await updatePublicMetadata({
				born: format(newValue, 'yyyy-MM-dd')
			})
		}

		if (attr.name !== 'sex' && attr.name !== 'born') {
			result = await updatePublicMetadata({
				[attr.name]: [
					{
						value: newValue,
						date: new Date().toISOString().split('T')[0]!
					}
				]
			})
		}

		dismiss()
		if (!result?.success) {
			toast.error(`Error updating your ${label}, please try again later.`)
			return
		}

		toast.success(`Your ${label} has been updated successfully.`)
		router.refresh()
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					className='h-auto w-full justify-start px-4 py-4'
					onClick={() => {
						if (name !== 'born') setIsOpen(true)
					}}
				>
					<Icon className='mr-2 h-5 w-5' />
					<div className='flex flex-col items-start'>
						<span className='font-medium'>{label}</span>
						<p
							className={`truncate text-xs tracking-tighter text-muted-foreground sm:text-sm sm:tracking-normal ${name !== 'weights' && name !== 'goalWeight' ? 'capitalize' : ''}`}
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
					<DialogTitle>{label}</DialogTitle>
				</DialogHeader>
				<SettingsField attr={{ ...attr, value, updateValue }} />
			</DialogContent>
		</Dialog>
	)
}
