'use client'

import { FemaleIcon, MaleIcon } from '~/components/ui/icons'
import { State } from '../_actions'
import { BornDatePicker } from '~/app/onboarding/_components/ui/born-date-picker'
import { useRef, useState } from 'react'
import { ONBOARDING_SECTIONS } from '../page'

type sex = 'male' | 'female'

export default function PersonalInfo({
	formState,
	setShowSection
}: {
	formState: State
	setShowSection: (section: string) => void
}) {
	const [sex, setSex] = useState<sex | null>(null)
	const [bornDate, setBornDate] = useState<Date | undefined>()
	const sexInputRef = useRef<HTMLInputElement>(null)
	const bornInputRef = useRef<HTMLInputElement>(null)

	const handleClickSex = (sex: sex) => () => {
		setSex(sex)
		if (!sexInputRef.current) return
		sexInputRef.current.value = sex
		if (sex && bornDate) setShowSection(ONBOARDING_SECTIONS.metrics)
	}

	const handleChangeDate = (date: Date | undefined) => {
		setBornDate(date)
		if (!bornInputRef.current || !date) return
		bornInputRef.current.value = date.toISOString()
		if (sex && date) setShowSection(ONBOARDING_SECTIONS.metrics)
	}

	return (
		<section className='z-10 mx-5 flex flex-col items-center space-y-5 text-center sm:mx-auto'>
			<h1 className='font-serif text-3xl font-bold text-green-600 dark:text-green-500'>
				trac<span className='text-wood-950 dark:text-wood-100'>ky</span>
			</h1>
			<article className='space-y-10'>
				<h2 className='font-display max-w-md text-3xl font-semibold transition-colors sm:text-4xl'>
					Which one is your sex?
				</h2>
				<article className='grid w-full grid-cols-1 divide-y divide-border rounded-md border border-border text-foreground md:grid-cols-2 md:divide-x'>
					<button
						className={`flex min-h-[200px] flex-col items-center justify-center space-y-5 overflow-hidden p-5 transition-colors hover:dark:bg-gray-800 md:p-10 ${sex === 'male' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
						onClick={handleClickSex('male')}
						type='button'
					>
						<MaleIcon className='pointer-events-none h-auto w-12 sm:w-12' />
						<p>Male</p>
					</button>
					<button
						className={`flex min-h-[200px] flex-col items-center justify-center space-y-5 overflow-hidden p-5 transition-colors hover:dark:bg-gray-800 md:p-10 ${sex === 'female' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
						onClick={handleClickSex('female')}
						type='button'
					>
						<FemaleIcon className='pointer-events-none h-auto w-12 sm:w-12' />
						<p>Female</p>
					</button>
				</article>
				<input type='hidden' name='sex' ref={sexInputRef} />
				{formState.errors?.sex ? (
					<div
						id='sex-error'
						aria-live='polite'
						className='mt-2 text-sm text-red-500'
					>
						{formState.errors.sex.map((error: string) => (
							<p key={error}>{error}</p>
						))}
					</div>
				) : null}
			</article>
			<article className='flex flex-col space-y-10 pt-5'>
				<h2 className='font-display max-w-lg text-3xl font-semibold transition-colors sm:text-4xl'>
					What is your date of birth?
				</h2>
				<div className='flex flex-col place-content-center items-center text-start'>
					<BornDatePicker
						formState={formState}
						date={bornDate}
						setDate={handleChangeDate}
					/>
				</div>
				<input type='hidden' name='born' ref={bornInputRef} />
			</article>
		</section>
	)
}
