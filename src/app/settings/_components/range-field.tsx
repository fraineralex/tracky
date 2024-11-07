import { ControllerRenderProps, FieldValues } from 'react-hook-form'
import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage
} from '~/components/ui/form'
import { Progress } from '~/components/ui/progress'
import { Slider } from '~/components/ui/slider'
import { SettingsAttr } from '~/types'

export function RangeField({
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
				{!attr.min && !attr.max ? (
					<Progress value={field.value} className='w-full' />
				) : (
					<Slider
						min={attr.min}
						max={attr.max}
						step={1}
						value={[field.value]}
						onValueChange={vals => field.onChange(vals[0])}
					/>
				)}
			</FormControl>
			<FormDescription>Current value: {field.value}%</FormDescription>
			<FormMessage />
		</FormItem>
	)
}
