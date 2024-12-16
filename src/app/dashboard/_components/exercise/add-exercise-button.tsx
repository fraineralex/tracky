import { Dumbbell } from 'lucide-react'
import { Button } from '~/components/ui/button'

export function AddExerciseButton() {
	return (
		<Button size='sm' className='flex-grow sm:flex-grow-0'>
			<Dumbbell className='mr-2 h-4 w-4' /> Add Exercise
		</Button>
	)
}
