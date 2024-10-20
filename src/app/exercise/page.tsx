import ExerciseMetrics from '~/app/exercise/_sections/exercise-metrics'
import { Header } from '~/app/exercise/_sections/header'
import { ExerciseGraphics } from '~/app/exercise/_sections/exercise-graphics'

export default function ExercisePage() {
	return (
		<div className='min-h-screen bg-background p-4 text-foreground md:p-8'>
			<div className='mx-auto max-w-7xl'>
				<Header />
				<ExerciseMetrics />
				<ExerciseGraphics />
			</div>
		</div>
	)
}
