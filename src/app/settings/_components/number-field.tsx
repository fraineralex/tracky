import { Input } from '~/components/ui/input'
import { SettingsAttr } from '~/types'

export function NumberField({ attr }: { attr: SettingsAttr }) {
	return (
		<article>
			<Input
				type='number'
				placeholder={attr.placeholder}
				value={attr.value as number}
			/>
		</article>
	)
}
