import ExerciseDialog from '~/app/dashboard/_components/exercise/exercise-dialog'
import AIChatDialog from '~/app/food/_components/ai-chat-dialog'
import { logExerciseAI, describeExerciseImage } from '../_actions'
import { AddExerciseButton } from '~/app/dashboard/_components/exercise/add-exercise-button'
import { Suspense } from 'react'

export function Header() {
	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	})

	return (
		<div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
			<h1 className='hidden text-xl font-bold uppercase sm:block lg:text-2xl'>
				{today}
			</h1>
			<div className='flex w-full flex-wrap items-center gap-2 sm:w-auto'>
				<Suspense fallback={<AddExerciseButton />}>
					<ExerciseDialog />
				</Suspense>
				<AIChatDialog
					action={logExerciseAI}
					placeholder='Log 30 minutes of cardio in the morning'
					title='Chat with AI'
					description='Tell the AI about your exercises, and it will log them for you.'
					instruction='Please specify the exercise, duration, intensity and diary group. You can also upload images from Apple Watch, treadmill displays, or fitness equipment.'
					describeImage={describeExerciseImage}
				/>
			</div>
		</div>
	)
}
