import { ControllerRenderProps, FieldValues } from 'react-hook-form'
import {
	FormControl,
	FormItem,
	FormLabel,
	FormMessage
} from '~/components/ui/form'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'
import { SettingsAttr } from '~/types'

export function SelectField({
	field,
	attr
}: {
	field: ControllerRenderProps<FieldValues>
	attr: SettingsAttr
}) {
	return (
		<FormItem>
			<FormLabel>{attr.label}</FormLabel>
			<Select onValueChange={field.onChange} defaultValue={field.value}>
				<FormControl>
					<SelectTrigger>
						<SelectValue placeholder={attr.placeholder} />
					</SelectTrigger>
				</FormControl>
				<SelectContent>
					{attr.options?.map(option => (
						<SelectItem
							className='capitalize'
							key={typeof option === 'string' ? option : option.key}
							value={typeof option === 'string' ? option : option.key}
						>
							{typeof option === 'string' ? option : option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<FormMessage />
		</FormItem>
	)
}
