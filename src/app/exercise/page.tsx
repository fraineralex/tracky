import ExerciseMetrics from '~/app/exercise/_sections/exercise-metrics'
import { Header } from '~/app/exercise/_sections/header'
import { ExerciseGraphics } from '~/app/exercise/_sections/exercise-graphics'

export default function ExercisePage() {

	
	return (
		<div className='min-h-screen bg-background px-0 py-5 text-foreground lg:px-4 xl:ms-5'>
			<div className='mx-auto max-w-7xl'>
				<Header />
				<ExerciseMetrics />
				<ExerciseGraphics />
			</div>
		</div>
	)
}
