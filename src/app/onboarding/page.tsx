'use client'

import { completeOnboarding, State } from './_actions'
import { useFormState } from 'react-dom'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import PersonalInfo from './_components/personal-info'
import BodyMetrics from './_components/body-metrics'
import FitnessGoals from './_components/fitness-goals'
import { useState } from 'react'

export const ONBOARDING_SECTIONS = {
	personal: 'personal-info',
	metrics: 'body-metrics',
	goals: 'fitness-goals'
}

export default function OnboardingPage() {
	const { user } = useUser()
	const router = useRouter()
	const initialState = { message: null, errors: {} }
	const [formState, dispatch] = useFormState<State, FormData>(
		completeOnboarding,
		initialState
	)
	const [showSection, setShowSection] = useState(ONBOARDING_SECTIONS.personal)

	async function redirectToDashboard() {
		toast.success('Onboarding complete')
		await user?.reload()
		router.push('/dashboard')
	}

	if (formState?.onboardingComplete) redirectToDashboard()

	if (!formState?.errors && formState?.message) toast.error(formState.message)

	return (
		<section className='flex w-full flex-col place-content-center place-items-center h-screen'>
			<form action={dispatch}>
				{showSection === ONBOARDING_SECTIONS.personal && (
					<PersonalInfo formState={formState} setShowSection={setShowSection} />
				)}

				{showSection === ONBOARDING_SECTIONS.metrics && (
					<BodyMetrics formState={formState} />
				)}

				{showSection === ONBOARDING_SECTIONS.goals && (
					<FitnessGoals formState={formState} />
				)}

				{formState.errors && formState.message && (
					<div
						id='amount-error'
						aria-live='polite'
						className='mt-2 text-sm text-red-500'
					>
						<p>{formState.message}</p>
					</div>
				)}
			</form>
		</section>
	)
}
