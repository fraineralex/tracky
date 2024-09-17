import { ComponentType } from 'react'
import { Card, CardContent, CardTitle } from '~/components/ui/card'

export function ExerciseCard({
	Icon,
	title,
	handleCategorySelect
}: {
	Icon: React.FC<React.SVGProps<SVGSVGElement>>
	title: string
	handleCategorySelect: () => void
}) {
	return (
		<Card
			className='flex h-40 w-40 cursor-pointer flex-col place-items-center bg-primary/10 hover:bg-primary/15'
			onClick={handleCategorySelect}
		>
			<CardContent className='my-auto pt-5'>
				<Icon className='mx-auto h-16 w-16 text-foreground/60 dark:text-foreground/80' />
				<CardTitle className='mt-3 text-center'>{title}</CardTitle>
			</CardContent>
		</Card>
	)
}
