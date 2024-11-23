import React from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { SettingsAttr } from '~/types'

export function NumberField({ attr }: { attr: SettingsAttr }) {
	const [newValue, setNewValue] = React.useState(attr.value as number)
	return (
		<>
			<article>
				<Input
					type='number'
					placeholder={attr.placeholder}
					value={newValue}
					onChange={e => setNewValue(Number(e.target.value))}
				/>
			</article>
			<Button
				type='submit'
				onClick={() => attr.updateValue?.(newValue)}
				disabled={newValue === attr.value}
			>
				Save Changes
			</Button>
		</>
	)
}
