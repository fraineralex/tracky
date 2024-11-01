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
			className='flex h-[100px] w-[100px] cursor-pointer flex-col place-items-center bg-primary/10 hover:bg-primary/15 sm:h-36 sm:w-36 md:h-40 md:w-40'
			onClick={handleCategorySelect}
		>
			<CardContent className='my-auto pt-3 md:pt-5'>
				<Icon className='mx-auto h-10 w-10 text-foreground/60 dark:text-foreground/80 md:h-16 md:w-16' />
				<CardTitle className='mt-1 text-center text-sm md:mt-3 md:text-lg'>
					{title}
				</CardTitle>
			</CardContent>
		</Card>
	)
}
