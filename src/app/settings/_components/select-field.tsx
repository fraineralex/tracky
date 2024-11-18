import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'
import { SettingsAttr } from '~/types'

export function SelectField({ attr }: { attr: SettingsAttr }) {
	return (
		<div>
			<Select defaultValue={attr.value as string}>
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
	)
}
