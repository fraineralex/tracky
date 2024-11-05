import ExerciseDialog from '~/app/dashboard/_components/exercise/exercise-dialog'
import AIChatDialog from '~/app/food/_components/ai-chat-dialog'
import { logExerciseAI } from '../_actions'

export function Header() {
	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	})

	return (
		<div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
			<h1 className='hidden text-2xl font-bold uppercase sm:block'>{today}</h1>
			<div className='flex w-full flex-wrap items-center gap-2 sm:w-auto'>
				<ExerciseDialog />
				<AIChatDialog
					action={logExerciseAI}
					placeholder='Log 30 minutes of cardio in the morning'
					title='Chat with AI'
					description='Tell the AI about your exercises, and it will log them for you.'
					instruction='Please specify the exercise, duration, intensity and diary group.'
				/>
			</div>
		</div>
	)
}
