import { Button } from '~/components/ui/button'
import { State } from '../_actions'

export default function FitnessGoals({ formState }: { formState: State }) {
	return (
		<section>
			<div>
				<label>Goal</label>
				<p>Enter your goal.</p>
				<input type='text' name='goal' required />
				{formState.errors?.goal ? (
					<div
						id='goal-error'
						aria-live='polite'
						className='mt-2 text-sm text-red-500'
					>
						{formState.errors.goal.map((error: string) => (
							<p key={error}>{error}</p>
						))}
					</div>
				) : null}
			</div>
			<div>
				<label>Activity</label>
				<p>Enter your activity level.</p>
				<input type='text' name='activity' required />
				{formState.errors?.activity ? (
					<div
						id='activity-error'
						aria-live='polite'
						className='mt-2 text-sm text-red-500'
					>
						{formState.errors.activity.map((error: string) => (
							<p key={error}>{error}</p>
						))}
					</div>
				) : null}
			</div>
            <Button type="submit">Submit</Button>
		</section>
	)
}
