'use client'

import { completeOnboarding } from './_actions'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import PersonalInfo from './_components/personal-info'
import BodyMetrics from './_components/body-metrics'
import FitnessGoals from './_components/fitness-goals'
import { useRef, useState } from 'react'
import { ONBOARDING_SECTIONS } from '~/constants'
import { Sex } from '~/types'
import confetti from 'canvas-confetti'

export default function OnboardingPage() {
	const { user } = useUser()
	const router = useRouter()
	const [showSection, setShowSection] = useState(ONBOARDING_SECTIONS.personal)
	const [sex, setSex] = useState<Sex>('male')
	const [bornDate, setBornDate] = useState(new Date(2000, 0, 1))
	const [heightUnit, setHeightUnit] = useState('ft')
	const [heightDecimal, setHeightDecimal] = useState(5)
	const [weightUnit, setWeightUnit] = useState('kg')
	const [height, setHeight] = useState(5)
	const [weight, setWeight] = useState(0)
	const [goal, setGoal] = useState<string | undefined>()
	const [activity, setActivity] = useState<string | undefined>()
	const formRef = useRef<HTMLFormElement>(null)
	const [bodyMetricsEntry, setBodyMetricsEntry] = useState(false)
	const [fitnessGoalsEntry, setFitnessGoalsEntry] = useState(false)

	async function sendForm() {
		formRef.current?.requestSubmit()
		const promise = () =>
			new Promise(resolve =>
				setTimeout(() => resolve({ name: 'Sonner' }), 100000)
			)

		toast.promise(promise, {
			loading: 'Completing onboarding...',
			id: 'onboarding-form'
		})
	}

	const handleSubmit = async (formData: FormData) => {
		const result = await completeOnboarding(formData)
		toast.dismiss('onboarding-form')
		if (!result.success) {
			toast.error(result.message)
			return
		}

		confetti()
		toast.success(result.message)
		await user?.reload()
		router.push('/dashboard')
	}

	return (
		<section className='flex w-full flex-col place-content-center place-items-center py-5'>
			<form ref={formRef} action={handleSubmit}>
				<PersonalInfo
					setShowSection={setShowSection}
					sex={{ value: sex, setValue: setSex }}
					bornDate={{ value: bornDate, setValue: setBornDate }}
					showSection={showSection === ONBOARDING_SECTIONS.personal}
					setBodyMetricsEntry={setBodyMetricsEntry}
				/>

				{bodyMetricsEntry && (
					<BodyMetrics
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
						showSection={showSection === ONBOARDING_SECTIONS.metrics}
						setFitnessGoalsEntry={setFitnessGoalsEntry}
					/>
				)}

				{fitnessGoalsEntry && (
					<FitnessGoals
						setShowSection={setShowSection}
						goal={{ value: goal, setValue: setGoal }}
						activity={{ value: activity, setValue: setActivity }}
						sendForm={sendForm}
						showSection={showSection === ONBOARDING_SECTIONS.goals}
					/>
				)}
			</form>
		</section>
	)
}
