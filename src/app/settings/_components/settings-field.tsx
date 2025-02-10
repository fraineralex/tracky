'use client'

import { FieldTypes, SettingsAttr } from '~/types'
import { DateField } from './date-field'
import { SelectField } from './select-field'
import { NumberField } from './number-field'
import { RangeField } from './range-field'

const fieldTypes: FieldTypes = {
	date: DateField,
	select: SelectField,
	number: NumberField,
	range: RangeField
}

export function SettingsField({ attr }: { attr: SettingsAttr }) {
	const Field = fieldTypes[attr.type]
	if (!Field) return null

	return <Field attr={attr} />
}
