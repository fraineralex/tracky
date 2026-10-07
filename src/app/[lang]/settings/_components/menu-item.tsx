'use client'

import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'
import {
	type AboutMenuItem,
	type ActivityLevel,
	type Goal,
	type Sex
} from '~/types'
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
import { updateUserProfile } from '../_actions'
import { loadingToast } from '~/lib/loading-toast'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { formatHeight } from '~/lib/utils'
import { useDictionary } from '~/components/providers/dictionary-provider'

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
	const { dictionary } = useDictionary()

	let displayValue = String(value)
	if (attr.name === 'born') displayValue = format(value, 'PP')
	if (attr.name === 'height') displayValue = formatHeight(value as number)
	if (attr.name === 'weights' || name === 'goalWeight')
		displayValue = `${Number(value)} kg`
	if (attr.name === 'fat' || name === 'progress')
		displayValue = `${Number(value)}%`
	// Use optionLabels for translated display values
	if (
		attr.optionLabels &&
		typeof value === 'string' &&
		attr.optionLabels[value]
	) {
		displayValue = attr.optionLabels[value]!
	}

	const Icon = ICONS[name as keyof typeof ICONS]

	const updateValue = async (newValue: typeof value) => {
		setIsOpen(false)
		setValue(newValue)
		const dismiss = loadingToast(dictionary.common.loading, 'update-metadata')

		const date = new Date().toISOString().split('T')[0]!
		let result
		switch (attr.name) {
			case 'sex':
				result = await updateUserProfile({ sex: newValue as Sex })
				break
			case 'born':
				result = await updateUserProfile({
					born: format(newValue as Date, 'yyyy-MM-dd')
				})
				break
			case 'height':
				result = await updateUserProfile({
					height: [{ value: Number(newValue), date }]
				})
				break
			case 'weights':
				result = await updateUserProfile({
					weights: [{ value: Number(newValue), date }]
				})
				break
			case 'activity':
				result = await updateUserProfile({
					activity: [{ value: newValue as ActivityLevel, date }]
				})
				break
			case 'goal':
				result = await updateUserProfile({
					goal: [{ value: newValue as Goal, date }]
				})
				break
			case 'goalWeight':
				result = await updateUserProfile({
					goalWeight: [{ value: Number(newValue), date }]
				})
				break
			case 'fat':
				result = await updateUserProfile({
					fat: [{ value: Number(newValue), date }]
				})
				break
			default:
				result = {
					success: false,
					message: 'Unsupported setting'
				}
		}

		dismiss()
		if (!result?.success) {
			toast.error(dictionary.common.error)
			return
		}

		toast.success(dictionary.toast.success.saved)
		router.refresh()
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					className='h-auto w-full justify-start px-4 py-4'
					onClick={() => {
						if (name !== 'born') {
							setIsOpen(true)
						}
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
				<SettingsField
					attr={{
						...attr,
						value,
						updateValue: nextValue => {
							void updateValue(nextValue)
						}
					}}
				/>
			</DialogContent>
		</Dialog>
	)
}
