import React from 'react'
import { Button } from '~/components/ui/button'
import { Progress } from '~/components/ui/progress'
import { Slider } from '~/components/ui/slider'
import { SettingsAttr } from '~/types'

export function RangeField({ attr }: { attr: SettingsAttr }) {
	const [newValue, setNewValue] = React.useState(attr.value as number)

	let progressValue = newValue
	if (attr.name !== 'exercise' && attr.max) {
		progressValue = (newValue / attr.max) * 100
	}
	return (
		<>
			<article>
				{attr.name === 'fat' ? (
					<Slider
						min={attr.min}
						max={attr.max}
						step={1}
						defaultValue={[newValue]}
						onValueChange={value => {
							if (value[0] !== undefined) {
								setNewValue(value[0])
							}
						}}
					/>
				) : (
					<Progress value={progressValue} max={attr.max} />
				)}
				<small className='text-muted-foreground'>
					Current value: {newValue}%
				</small>
			</article>
			{attr.name === 'fat' && (
				<Button
					type='submit'
					onClick={() => attr.updateValue?.(newValue)}
					disabled={newValue === attr.value}
				>
					Save Changes
				</Button>
			)}
		</>
	)
}
