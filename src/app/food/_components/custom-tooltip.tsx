interface Props {
	active?: boolean
	payload?: { color: string; name: string; value: string }[]
	label?: string
}

export function CustomTooltip({ active, payload, label }: Props) {
	if (!active || !payload || !payload.length) return null

	return (
		<div className='rounded-lg border border-border bg-background p-4 shadow-lg'>
			<p className='mb-2 font-semibold text-foreground'>{label}</p>
			{payload.map((entry, index) => (
				<p key={`item-${index}`} className='text-sm'>
					<span className='font-medium' style={{ color: entry.color }}>
						{entry.name}
					</span>
					: {entry.value}
				</p>
			))}
		</div>
	)
}
