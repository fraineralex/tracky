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
			className='flex h-32 w-32 sm:w-36 sm:h-w-36 cursor-pointer flex-col place-items-center bg-primary/10 hover:bg-primary/15 md:h-40 md:w-40'
			onClick={handleCategorySelect}
		>
			<CardContent className='my-auto pt-5'>
				<Icon className='mx-auto h-10 w-10 text-foreground/60 dark:text-foreground/80 md:h-16 md:w-16' />
				<CardTitle className='mt-3 text-center'>{title}</CardTitle>
			</CardContent>
		</Card>
	)
}
