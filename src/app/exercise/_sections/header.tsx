import ExerciseDialog from '~/app/dashboard/_components/exercise/exercise-dialog'
import AIChatDialog from '~/app/food/_components/ai-chat-dialog'

export function Header() {
	return (
		<div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
			<h1 className='hidden text-3xl font-bold sm:block'>Exercise Tracker</h1>
			<div className='flex w-full flex-wrap items-center gap-2 sm:w-auto'>
				<ExerciseDialog />
				<AIChatDialog />
			</div>
		</div>
	)
}
