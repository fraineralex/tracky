import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '~/components/ui/tooltip'

export function NutritionSquare({
	dayIndex,
	nutrientIndex,
	dayOfWeek,
	percentage,
	days
}: {
	dayIndex: number
	nutrientIndex: number
	dayOfWeek: number
	percentage: string
	days: string[]
}) {
	const daysText = [
		'Mondey',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday'
	]
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					{dayIndex < 7 && nutrientIndex < 4 ? (
						<span
							className='rounded-md px-4 py-4'
							key={dayIndex}
							style={{
								background: `linear-gradient(to top, hsl(var(--foreground) / ${dayIndex === dayOfWeek ? '1' : '0.5'}) ${percentage}%, hsl(var(--primary) / 0.2) ${percentage}%)`
							}}
						></span>
					) : (
						<span
							className={`-ms-1 px-3 py-2 ${dayIndex === dayOfWeek ? 'rounded-md border-2 border-primary font-semibold' : ''}`}
							key={dayIndex}
						>
							{days[dayIndex]}
						</span>
					)}
				</TooltipTrigger>
				<TooltipContent>
					{dayIndex < 7 && nutrientIndex < 4 ? (
						<p>{percentage}%</p>
					) : (
						<p>{daysText[dayIndex]}</p>
					)}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
