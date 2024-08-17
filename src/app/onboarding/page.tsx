'use client'

import { completeOnboarding, State } from './_actions'
import { useFormState } from 'react-dom'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import PersonalInfo from './_components/personal-info'
import BodyMetrics from './_components/body-metrics'
import FitnessGoals from './_components/fitness-goals'
import { useRef, useState } from 'react'
import { ONBOARDING_SECTIONS } from '~/constants'
import { sex } from '~/types'

export default function OnboardingPage() {
	const { user } = useUser()
	const router = useRouter()
	const initialState = { message: null, errors: {} }
	const [formState, dispatch] = useFormState<State, FormData>(
		completeOnboarding,
		initialState
	)
	const [showSection, setShowSection] = useState(ONBOARDING_SECTIONS.metrics)
	const [sex, setSex] = useState<sex | undefined>()
	const [bornDate, setBornDate] = useState<Date | undefined>()
	const [heightUnit, setHeightUnit] = useState('ft')
	const [heightDecimal, setHeightDecimal] = useState(5)
	const [weightUnit, setWeightUnit] = useState('lb')
	const [height, setHeight] = useState(1)
	const [weight, setWeight] = useState(0)
	const [goal, setGoal] = useState<string | undefined>()
	const [activity, setActivity] = useState<string | undefined>()
	const formRef = useRef<HTMLFormElement>(null)

	async function redirectToDashboard() {
		toast.success('Onboarding complete')
		await user?.reload()
		router.push('/dashboard')
	}

	if (formState?.onboardingComplete) redirectToDashboard()

	if (!formState?.errors && formState?.message) toast.error(formState.message)

	function sendForm() {
		formRef.current?.submit()
	}

	return (
		<section className='flex h-screen w-full flex-col place-content-center place-items-center'>
			<form action={dispatch} ref={formRef}>
				{showSection === ONBOARDING_SECTIONS.personal && (
					<PersonalInfo
						formState={formState}
						setShowSection={setShowSection}
						sex={{ value: sex, setValue: setSex }}
						bornDate={{ value: bornDate, setValue: setBornDate }}
					/>
				)}

				{showSection === ONBOARDING_SECTIONS.metrics && (
					<BodyMetrics
						formState={formState}
						setShowSection={setShowSection}
						height={{
							value: height,
							setValue: setHeight,
							unit: heightUnit,
							setUnit: setHeightUnit,
							decimal: heightDecimal,
							setDecimal: setHeightDecimal
						}}
						weight={{
							value: weight,
							setValue: setWeight,
							unit: weightUnit,
							setUnit: setWeightUnit
						}}
					/>
				)}

				{showSection === ONBOARDING_SECTIONS.goals && (
					<FitnessGoals
						formState={formState}
						setShowSection={setShowSection}
						goal={{ value: goal, setValue: setGoal }}
						activity={{ value: activity, setValue: setActivity }}
						sendForm={sendForm}
					/>
				)}

				{/* {formState.errors && formState.message && (
					<div
						id='amount-error'
						aria-live='polite'
						className='mt-2 text-sm text-red-500'
					>
						<p>{formState.message}</p>
					</div>
				)} */}
			</form>
		</section>
	)
}
