import { Progress } from '~/components/ui/progress'
import { Slider } from '~/components/ui/slider'
import { SettingsAttr } from '~/types'

export function RangeField({ attr }: { attr: SettingsAttr }) {
	const value = attr.value as number
	let progressValue = value
	if (attr.name !== 'exercise' && attr.max) {
		progressValue = (value / attr.max) * 100
	}
	return (
		<article>
			{attr.name === 'exercise' ? (
				<Slider
					min={attr.min}
					max={attr.max}
					step={1}
					defaultValue={[value]}
					onValueChange={value => {
						if (value[0] !== undefined) {
							attr.updateValue?.(value[0])
						}
					}}
				/>
			) : (
				<Progress value={progressValue} max={attr.max} />
			)}
			<small className='text-muted-foreground'>Current value: {value}%</small>
		</article>
	)
}
