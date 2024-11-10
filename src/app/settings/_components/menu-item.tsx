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
import { SettingsForm } from './form'
import React from 'react'

export function MenuItem({
	menuItem,
	aboutMenuItem,
	settingsDefaultValue
}: {
	menuItem?: SettingsMenuItem
	settingsDefaultValue: Record<string, string | number | Date>
	aboutMenuItem?: AboutMenuItem
}) {
	const [openModal, setOpenModal] = React.useState<string | null>(null)
	const [settings, setSettings] = React.useState(settingsDefaultValue)

	const isMenuItem = menuItem !== undefined
	const item = isMenuItem ? menuItem : aboutMenuItem
	if (!item) return null
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
					<item.icon className='mr-2 h-5 w-5' />
					<div className='flex flex-col items-start'>
						<span className='font-medium'>{item.label}</span>
						<span className='text-sm text-muted-foreground'>
							{isMenuItem
								? (item as SettingsMenuItem).formatValue(
										settings[item.label.toLowerCase()] ?? ''
									)
								: item.description}
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
				{isMenuItem && (
					<SettingsForm
						item={item as SettingsMenuItem}
						onClose={() => setOpenModal(null)}
						onSave={value => {
							setSettings(prev => ({
								...prev,
								[item.label.toLowerCase()]: value
							}))
						}}
						initialValue={
							settings[item.label.toLowerCase()] ??
							(item as SettingsMenuItem).defaultValue
						}
					/>
				)}
				{!isMenuItem && (item as AboutMenuItem).content}
			</DialogContent>
		</Dialog>
	)
}
