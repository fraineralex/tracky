import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { SettingsMenuItem } from '~/types'

export function SettingsForm({
	item,
	onClose,
	onSave,
	initialValue
}: {
	item: SettingsMenuItem
	onClose: () => void
	onSave: (value: string | number | Date) => void
	initialValue: string | number | Date
}) {
	const form = useForm<z.infer<typeof item.schema>>({
		resolver: zodResolver(item.schema),
		defaultValues: {
			[item.label.toLowerCase()]: initialValue
		}
	})

	function onSubmit(values: z.infer<typeof item.schema>) {
		console.log(values)
		onSave(values[item.label.toLowerCase()])
		onClose()
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				{/* {item.formFields(form)} */}
				{item.label !== 'Goal Progress' && (
					<Button type='submit'>Save Changes</Button>
				)}
			</form>
		</Form>
	)
}
