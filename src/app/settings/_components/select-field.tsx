import React from 'react'
import { Button } from '~/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'
import { SettingsAttr } from '~/types'

export function SelectField({ attr }: { attr: SettingsAttr }) {
	const [option, setOption] = React.useState(attr.value as string)

	return (
		<>
			<div>
				<Select defaultValue={option} onValueChange={value => setOption(value)}>
					<SelectTrigger className='capitalize'>
						<SelectValue placeholder={attr.value as string} />
					</SelectTrigger>
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
			</div>
			<Button
				type='submit'
				onClick={() => attr.updateValue?.(option)}
				disabled={option === attr.value}
			>
				Save Changes
			</Button>
		</>
	)
}
