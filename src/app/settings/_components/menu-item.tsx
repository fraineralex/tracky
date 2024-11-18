'use client'

import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'
import { AboutMenuItem, SettingsMenuItem } from '~/types'
import React from 'react'
import {
	Activity,
	Calendar,
	Dumbbell,
	Flag,
	Heart,
	Info,
	Mail,
	Ruler,
	Target,
	User,
	Weight
} from 'lucide-react'

const ICONS = {
	birthday: Calendar,
	sex: User,
	height: Ruler,
	weight: Weight,
	goalweight: Target,
	fat: Weight,
	activity: Activity,
	exercise: Dumbbell,
	cardio: Heart,
	lifting: Dumbbell,
	goal: Flag,
	progress: Target,
	contact: Mail,
	info: Info
}

export function MenuItem({
	menuItem,
	aboutMenuItem,
}: {
	menuItem?: SettingsMenuItem
	aboutMenuItem?: AboutMenuItem
}) {
	const [openModal, setOpenModal] = React.useState<string | null>(null)

	const isMenuItem = menuItem !== undefined
	const item = isMenuItem ? menuItem : aboutMenuItem
	if (!item) return null
	const Icon = ICONS[item.name as keyof typeof ICONS]
	return (
		<Dialog
			key={item.label}
			open={openModal === item.label}
			onOpenChange={isOpen => setOpenModal(isOpen ? item.label : null)}
		>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					className='h-auto w-full justify-start px-4 py-4'
				>
					<Icon className='mr-2 h-5 w-5' />
					<div className='flex flex-col items-start'>
						<span className='font-medium'>{item.label}</span>
						<span className='text-sm text-muted-foreground'>
							{isMenuItem ? item.label : item.description}
						</span>
					</div>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{isMenuItem || ('content' in item && item.content && item.label)}
					</DialogTitle>
				</DialogHeader>
				{!isMenuItem && (item as AboutMenuItem).content}
			</DialogContent>
		</Dialog>
	)
}
