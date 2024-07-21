'use client'

import { completeOnboarding, State } from './_actions'
import { useFormState } from 'react-dom'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function OnboardingPage() {
	const { user } = useUser()
	const router = useRouter()
	const initialState = { message: null, errors: {} }
	const [state, dispatch] = useFormState<State, FormData>(
		completeOnboarding,
		initialState
	)

	async function redirectToDashboard() {
		toast.success('Onboarding complete')
		await user?.reload()
		router.push('/dashboard')
	}

	if (state?.onboardingComplete) redirectToDashboard()

	if (!state?.errors && state?.message) toast.error(state.message)

	return (
		<section>
			<h1>Welcome</h1>
			<form action={dispatch}>
				<div>
					<label>Sex</label>
					<p>Select your sex.</p>
					<input type='text' name='sex' required />
					{state.errors?.sex ? (
						<div
							id='sex-error'
							aria-live='polite'
							className='mt-2 text-sm text-red-500'
						>
							{state.errors.sex.map((error: string) => (
								<p key={error}>{error}</p>
							))}
						</div>
					) : null}
				</div>
				<div>
					<label>Born</label>
					<p>Enter your born date.</p>
					<input type='date' name='born' required />
					{state.errors?.born ? (
						<div
							id='born-error'
							aria-live='polite'
							className='mt-2 text-sm text-red-500'
						>
							{state.errors.born.map((error: string) => (
								<p key={error}>{error}</p>
							))}
						</div>
					) : null}
				</div>
				<div>
					<label>Height</label>
					<p>Enter your height.</p>
					<input type='number' name='height' required />
					{state.errors?.height ? (
						<div
							id='height-error'
							aria-live='polite'
							className='mt-2 text-sm text-red-500'
						>
							{state.errors.height.map((error: string) => (
								<p key={error}>{error}</p>
							))}
						</div>
					) : null}
				</div>
				<div>
					<label>Weight</label>
					<p>Enter your weight.</p>
					<input type='number' name='weight' required />
					{state.errors?.weight ? (
						<div
							id='weight-error'
							aria-live='polite'
							className='mt-2 text-sm text-red-500'
						>
							{state.errors.weight.map((error: string) => (
								<p key={error}>{error}</p>
							))}
						</div>
					) : null}
				</div>
				<div>
					<label>Goal</label>
					<p>Enter your goal.</p>
					<input type='text' name='goal' required />
					{state.errors?.goal ? (
						<div
							id='goal-error'
							aria-live='polite'
							className='mt-2 text-sm text-red-500'
						>
							{state.errors.goal.map((error: string) => (
								<p key={error}>{error}</p>
							))}
						</div>
					) : null}
				</div>
				<div>
					<label>Activity</label>
					<p>Enter your activity level.</p>
					<input type='text' name='activity' required />
					{state.errors?.activity ? (
						<div
							id='activity-error'
							aria-live='polite'
							className='mt-2 text-sm text-red-500'
						>
							{state.errors.activity.map((error: string) => (
								<p key={error}>{error}</p>
							))}
						</div>
					) : null}
				</div>

				<input type='hidden' name='heightUnit' value='cm' />
				<input type='hidden' name='weightUnit' value='lb' />

				{state.errors && state.message && (
					<div
						id='amount-error'
						aria-live='polite'
						className='mt-2 text-sm text-red-500'
					>
						<p>{state.message}</p>
					</div>
				)}
				<button type='submit'>Submit</button>
			</form>
		</section>
	)
}
