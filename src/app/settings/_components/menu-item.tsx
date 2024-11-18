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

export function MenuItem({
	name,
	label,
	description,
	content,
	attr,
	displayValue,
	Icon
}: AboutMenuItem) {
	return (
		<Dialog key={label}>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					className='h-auto w-full justify-start px-4 py-4'
				>
					<Icon className='mr-2 h-5 w-5' />
					<div className='flex flex-col items-start'>
						<span className='font-medium'>{label}</span>
						<span className='text-sm capitalize text-muted-foreground'>
							{attr ? displayValue || attr.value.toString() : description}
						</span>
					</div>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{label}</DialogTitle>
				</DialogHeader>
				{attr && <SettingsField attr={attr} />}
				{name !== 'fat' && name !== 'progress' && attr && (
					<Button type='submit'>Save Changes</Button>
				)}
				{!attr && content && content}
			</DialogContent>
		</Dialog>
	)
}
