'use strict'

import { FemaleIcon, MaleIcon } from '~/components/ui/icons'
import { State } from '../_actions'
import { BornDatePicker } from '~/app/onboarding/_components/ui/born-date-picker'
import { useRef, useState } from 'react'
import { ONBOARDING_SECTIONS } from '~/constants'
import { sex } from '~/types'
import { Button } from '~/components/ui/button'
import { ChevronRight } from 'lucide-react'

export default function PersonalInfo({
	formState,
	setShowSection,
	sex,
	bornDate
}: {
	formState: State
	setShowSection: (section: string) => void
	sex: {
		value: sex | undefined
		setValue: (sexParam: sex) => void
	}
	bornDate: {
		value: Date | undefined
		setValue: (date: Date | undefined) => void
	}
}) {
	const sexInputRef = useRef<HTMLInputElement | null>(null)
	const bornDateInputRef = useRef<HTMLInputElement | null>(null)

	const handleClickSex = (value: sex) => () => {
		sex.setValue(value)
		if (sexInputRef.current) sexInputRef.current.value = value
		if (value && bornDate.value) setShowSection(ONBOARDING_SECTIONS.metrics)
	}

	const handleChangeDate = (date: Date | undefined) => {
		bornDate.setValue(date)
		if (bornDateInputRef.current && date)
			bornDateInputRef.current.value = date?.toISOString()
		if (sex.value && date) setShowSection(ONBOARDING_SECTIONS.metrics)
	}

	return (
		<section className='z-10 mx-5 flex flex-col items-center space-y-10 text-center sm:mx-auto'>
			<h1 className='font-serif text-3xl font-bold text-green-600 dark:text-green-500'>
				trac<span className='text-wood-950 dark:text-wood-100'>ky</span>
			</h1>
			<article className='space-y-10'>
				<h2 className='font-display max-w-md text-3xl font-semibold transition-colors sm:text-4xl'>
					Which one is your sex?
				</h2>
				<article className='grid w-full grid-cols-1 divide-y divide-border rounded-md border border-border text-foreground md:grid-cols-2 md:divide-x'>
					<button
						className={`flex min-h-[200px] flex-col items-center justify-center space-y-5 overflow-hidden p-5 transition-colors md:p-10 ${sex.value === 'male' ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-200 hover:dark:bg-gray-800'}`}
						onClick={handleClickSex('male')}
						type='button'
						disabled={sex.value === 'male'}
					>
						<MaleIcon className='pointer-events-none h-auto w-12 sm:w-12' />
						<p>Male</p>
					</button>
					<button
						className={`flex min-h-[200px] flex-col items-center justify-center space-y-5 overflow-hidden p-5 transition-colors md:p-10 ${sex.value === 'female' ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-200 hover:dark:bg-gray-800'}`}
						onClick={handleClickSex('female')}
						type='button'
						disabled={sex.value === 'female'}
					>
						<FemaleIcon className='pointer-events-none h-auto w-12 sm:w-12' />
						<p>Female</p>
					</button>
				</article>
				<input type='hidden' name='sex' value={sex.value} ref={sexInputRef} />
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
						date={bornDate.value}
						setDate={handleChangeDate}
					/>
				</div>
				<input
					type='hidden'
					name='born'
					value={bornDate.value?.toISOString()}
					ref={bornDateInputRef}
				/>
			</article>
			<footer className='flex w-full justify-end'>
				<Button
					type='button'
					variant={`${sex.value && bornDate.value ? 'default' : 'secondary'}`}
					className='mt-5 text-base font-medium'
					onClick={() => setShowSection(ONBOARDING_SECTIONS.metrics)}
				>
					<ChevronRight />
				</Button>
			</footer>
		</section>
	)
}
