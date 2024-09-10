import { Dumbbell, LucideProps, Plus } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '~/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'
import {
	Cleaner,
	Contruction,
	Cycling,
	Runnig,
	SoccerKick,
	Stretching,
	Treadmill
} from '~/components/ui/icons'

export function ExerciseCard({
	Icon,
	title
}: {
	Icon:
		| React.ForwardRefExoticComponent<
				Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
		  >
		| React.FC<LucideProps>
	title: string
}) {
	return (
		<Card className='flex h-40 w-40 cursor-pointer flex-col place-items-center bg-primary/10 hover:bg-primary/15'>
			<CardContent className='my-auto pt-5'>
				<Icon className='h-16 w-16 mx-auto' />
				<CardTitle className='mt-3 text-center'>{title}</CardTitle>
			</CardContent>
		</Card>
	)
}

export default function ExerciseDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='default' className='font-medium'>
					<Plus className='me-2' />
					Add Exercise
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-3xl'>
				<DialogHeader className='px-5'>
					<DialogTitle>Register Exercise</DialogTitle>
				</DialogHeader>
				<div className='grid grid-cols-4 gap-4 px-5 py-10'>
					<ExerciseCard title='Gym' Icon={Dumbbell} />
					<ExerciseCard title='Cardio' Icon={Treadmill} />
					<ExerciseCard title='Household Activity' Icon={Cleaner} />
					<ExerciseCard title='Individual Sport' Icon={Runnig} />
					<ExerciseCard title='Team Sport' Icon={SoccerKick} />
					<ExerciseCard title='Occupational Activity' Icon={Contruction} />
					<ExerciseCard title='Outdoor Activity' Icon={Cycling} />
					<ExerciseCard title='Strength & Mobility' Icon={Stretching} />
				</div>
			</DialogContent>
		</Dialog>
	)
}
