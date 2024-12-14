'use strict'

import { FemaleIcon, MaleIcon } from '~/components/ui/icons'
import { BornDatePicker } from '~/app/onboarding/_components/ui/born-date-picker'
import { useRef } from 'react'
import { ONBOARDING_SECTIONS } from '~/constants'
import { Sex } from '~/types'
import { Button } from '~/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { STAGGER_CHILD_VARIANTS } from '~/constants'

export default function PersonalInfo({
	setShowSection,
	sex,
	bornDate,
	showSection,
	setBodyMetricsEntry
}: {
	setShowSection: (section: string) => void
	sex: {
		value: Sex | undefined
		setValue: (sexParam: Sex) => void
	}
	bornDate: {
		value: Date | undefined
		setValue: (date: Date | undefined) => void
	}
	showSection: boolean
	setBodyMetricsEntry: (entry: boolean) => void
}) {
	const sexInputRef = useRef<HTMLInputElement | null>(null)
	const bornDateInputRef = useRef<HTMLInputElement | null>(null)

	const handleClickSex = (value: Sex) => () => {
		sex.setValue(value)
		if (sexInputRef.current) sexInputRef.current.value = value
		if (value && bornDate.value) handleClickNext()
	}

	const handleChangeDate = (date: Date | undefined) => {
		bornDate.setValue(date)
		if (bornDateInputRef.current && date)
			bornDateInputRef.current.value = date?.toISOString()
		if (sex.value && date) handleClickNext()
	}

	const handleClickNext = () => {
		setShowSection(ONBOARDING_SECTIONS.metrics)
		setBodyMetricsEntry(true)
	}

	return (
		<motion.section
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.3, type: 'spring' }}
		>
			{' '}
			<div className={`z-10 mx-5 ${showSection ? 'flex' : 'hidden'}`}>
				<motion.div
					variants={{
						show: {
							transition: {
								staggerChildren: 0.2
							}
						}
					}}
					initial='hidden'
					animate='show'
				>
					{' '}
					<div className='flex flex-col items-center space-y-10 text-center sm:mx-auto'>
						<motion.h1 variants={STAGGER_CHILD_VARIANTS}>
							<span className='font-serif text-3xl font-bold text-green-600 dark:text-green-500'>
								trac<span className='text-wood-950 dark:text-wood-100'>ky</span>
							</span>
						</motion.h1>
						<motion.article variants={STAGGER_CHILD_VARIANTS}>
							<div className='flex flex-col space-y-10'>
								<h2 className='font-display max-w-lg text-xl font-semibold transition-colors lg:text-3xl'>
									What is your date of birth?
								</h2>
								<div className='flex flex-col place-content-center items-center text-start'>
									<BornDatePicker
										date={bornDate.value}
										setDate={handleChangeDate}
										showSection={showSection}
									/>
								</div>
								<input
									type='hidden'
									name='born'
									value={bornDate.value?.toISOString()}
									ref={bornDateInputRef}
								/>
							</div>
						</motion.article>
						<motion.article variants={STAGGER_CHILD_VARIANTS}>
							<div className='space-y-10 pt-5'>
								<h2 className='font-display max-w-md text-xl font-semibold transition-colors lg:text-3xl'>
									Which one is your sex?
								</h2>
								<article className='grid w-full grid-cols-1 divide-y rounded-md border border-border text-foreground md:grid-cols-2 md:divide-x md:divide-y-0'>
									<button
										className={`flex flex-col items-center justify-center space-y-5 overflow-hidden p-5 transition-colors min-h-[200px] min-w-[200px] md:p-10 ${sex.value === 'male' ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-200 hover:dark:bg-gray-800'}`}
										onClick={handleClickSex('male')}
										type='button'
										disabled={sex.value === 'male'}
									>
										<MaleIcon className='pointer-events-none h-auto w-12 sm:w-12' />
										<p>Male</p>
									</button>
									<button
										className={`flex min-h-[200px] min-w-[200px] flex-col items-center justify-center space-y-5 overflow-hidden p-5 transition-colors md:p-10 ${sex.value === 'female' ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-200 hover:dark:bg-gray-800'}`}
										onClick={handleClickSex('female')}
										type='button'
										disabled={sex.value === 'female'}
									>
										<FemaleIcon className='pointer-events-none h-auto w-12 sm:w-12' />
										<p>Female</p>
									</button>
								</article>
								<input
									type='hidden'
									name='sex'
									value={sex.value}
									ref={sexInputRef}
								/>
							</div>
						</motion.article>
						<motion.footer variants={STAGGER_CHILD_VARIANTS}>
							<div className='flex w-full justify-end'>
								<Button
									type='button'
									variant={`${sex.value && bornDate.value ? 'default' : 'secondary'}`}
									className='mt-5 text-base font-medium'
									onClick={handleClickNext}
									disabled={!sex.value || !bornDate.value}
								>
									<ChevronRight />
								</Button>
							</div>
						</motion.footer>
					</div>
				</motion.div>
			</div>
		</motion.section>
	)
}
