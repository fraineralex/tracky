'use client'

import { completeOnboarding } from './_actions'
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
import confetti from 'canvas-confetti'

export default function OnboardingPage() {
	const { user } = useUser()
	const router = useRouter()
	const [showSection, setShowSection] = useState(ONBOARDING_SECTIONS.personal)
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

	async function sendForm() {
		confetti()
		toast.success('Onboarding complete')
		formRef.current?.requestSubmit()
	}

	const handleSubmit = async (formData: FormData) => {
		await completeOnboarding(formData)
		await user?.reload()
		router.push('/dashboard')
	}

	return (
		<section className='flex h-screen w-full flex-col place-content-center place-items-center'>
			<form ref={formRef} action={handleSubmit}>
				<PersonalInfo
					setShowSection={setShowSection}
					sex={{ value: sex, setValue: setSex }}
					bornDate={{ value: bornDate, setValue: setBornDate }}
					showSection={showSection === ONBOARDING_SECTIONS.personal}
				/>

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
				/>

				<FitnessGoals
					setShowSection={setShowSection}
					goal={{ value: goal, setValue: setGoal }}
					activity={{ value: activity, setValue: setActivity }}
					sendForm={sendForm}
					showSection={showSection === ONBOARDING_SECTIONS.goals}
				/>
			</form>
		</section>
	)
}
