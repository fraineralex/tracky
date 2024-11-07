import { ControllerRenderProps, FieldValues, useForm } from 'react-hook-form'
import { FormField, FormItem, FormMessage } from '~/components/ui/form'
import { SettingsAttr, SettingsFieldType } from '~/types'
import { DateField } from './date-field'
import { SelectField } from './select-field'
import { NumberField } from './number-field'
import { RangeField } from './range-field'

export function SettingsField({
	form,
	attr
}: {
	form: ReturnType<typeof useForm>
	attr: SettingsAttr
}) {
	const fieldTypes: Record<
		SettingsFieldType,
		React.FC<{ field: ControllerRenderProps<FieldValues>; attr: SettingsAttr }>
	> = {
		date: DateField,
		select: SelectField,
		number: NumberField,
		range: RangeField
	}

	return (
		<FormField
			control={form.control}
			name={attr.name}
			render={({ field }) => (
				<FormItem className='flex flex-col'>
					{fieldTypes[attr.type]({ field, attr })}
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
