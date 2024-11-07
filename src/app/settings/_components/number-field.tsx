import { ControllerRenderProps, FieldValues } from 'react-hook-form'
import {
	FormControl,
	FormItem,
	FormLabel,
	FormMessage
} from '~/components/ui/form'
import { SettingsAttr } from '~/types'

export function NumberField({
	field,
	attr
}: {
	field: ControllerRenderProps<FieldValues>
	attr: SettingsAttr
}) {
	return (
		<FormItem>
			<FormLabel>{attr.label}</FormLabel>
			<FormControl>
				<input type='number' {...field} placeholder={attr.placeholder} />
			</FormControl>
			<FormMessage />
		</FormItem>
	)
}
