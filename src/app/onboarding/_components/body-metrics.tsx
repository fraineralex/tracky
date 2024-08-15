import { Input } from '~/components/ui/input'
import { State } from '../_actions'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { ONBOARDING_SECTIONS } from '~/constants'

export default function BodyMetrics({
	formState,
	setShowSection
}: {
	formState: State
	setShowSection: (section: string) => void
}) {
	const [heightUnit, setHeightUnit] = useState('ft')
	const [heightDecimal, setHeightDecimal] = useState(5)
	const [weightUnit, setWeightUnit] = useState('lb')
	const [height, setHeight] = useState(1)
	const [weight, setWeight] = useState(0)

	let heightLength = heightUnit === 'ft' ? 8 : 250
	if (heightUnit === 'm') heightLength = 2

	const decimalLength = heightUnit === 'ft' ? 11 : 99

	const handleClickNext = () => {
		if (height && weight) {
			setShowSection(ONBOARDING_SECTIONS.goals)
		}
	}

	return (
		<section className='z-10 mx-5 flex flex-col items-center space-y-10 text-center sm:mx-auto'>
			<h1 className='font-serif text-3xl font-bold text-green-600 dark:text-green-500'>
				trac<span className='text-wood-950 dark:text-wood-100'>ky</span>
			</h1>
			<div className='space-y-10'>
				<article className='space-y-1'>
					<h2 className='font-display max-w-md text-start text-sm font-semibold transition-colors'>
						What is your height?
					</h2>
					<div
						className={`flex items-center ${heightUnit === 'cm' ? 'space-x-2' : 'space-x-3'}`}
					>
						<span className='flex items-center space-x-1'>
							<Select
								name='height'
								defaultValue={height.toString()}
								required
								onValueChange={value => setHeight(Number(value))}
							>
								<SelectTrigger
									className={`${heightUnit === 'cm' ? 'w-[180px]' : 'w-[80px]'} border-gray-400`}
								>
									<SelectValue placeholder={height.toString()} />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Height</SelectLabel>
										{Array.from({ length: heightLength }, (_, i) => (
											<SelectItem key={i} value={String(i + 1)}>
												{i + 1}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							{heightUnit !== 'cm' && (
								<>
									<p
										className={`${heightUnit === 'ft' ? '-mt-5' : 'mt-5'} font-semibold`}
									>
										{heightUnit === 'ft' ? '″' : '.'}
									</p>
									<Select
										name='heightDecimal'
										defaultValue={heightDecimal.toString()}
										required
										onValueChange={value => setHeightDecimal(Number(value))}
									>
										<SelectTrigger className='w-[80px] border-gray-400'>
											<SelectValue placeholder={heightDecimal.toString()} />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Height</SelectLabel>
												{Array.from({ length: decimalLength }, (_, i) => (
													<SelectItem key={i} value={i.toString()}>
														{i}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</>
							)}
						</span>
						<Select
							name='heightUnit'
							defaultValue='ft'
							onValueChange={value => setHeightUnit(value)}
						>
							<SelectTrigger className='w-[80px] border-gray-400'>
								<SelectValue placeholder='ft' />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Unity of measure</SelectLabel>
									<SelectItem value='ft'>ft</SelectItem>
									<SelectItem value='m'>m</SelectItem>
									<SelectItem value='cm'>cm</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					{formState.errors?.height ? (
						<div
							id='height-error'
							aria-live='polite'
							className='mt-2 text-sm text-red-500'
						>
							{formState.errors.height.map((error: string) => (
								<p key={error}>{error}</p>
							))}
						</div>
					) : null}
				</article>
				<article className='space-y-1'>
					<h2 className='font-display max-w-md text-start text-sm font-semibold transition-colors'>
						What is your weight?
					</h2>
					<div className='flex items-center space-x-2'>
						<Input
							type='number'
							name='weight'
							placeholder='weight'
							className='w-[180px] border-gray-400 focus:border-gray-300'
							required
							onChange={e => setWeight(Number(e.target.value))}
						/>
						<Select
							name='weightUnit'
							defaultValue='lb'
							onValueChange={value => setWeightUnit(value)}
						>
							<SelectTrigger className='w-[80px] border-gray-400'>
								<SelectValue placeholder='lb' />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Unity of measure</SelectLabel>
									<SelectItem value='lb'>lb</SelectItem>
									<SelectItem value='kg'>kg</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					{formState.errors?.weight ? (
						<div
							id='weight-error'
							aria-live='polite'
							className='mt-2 text-sm text-red-500'
						>
							{formState.errors.weight.map((error: string) => (
								<p key={error}>{error}</p>
							))}
						</div>
					) : null}
				</article>
				<input type='hidden' name='heightUnit' value='cm' />
				<input type='hidden' name='weightUnit' value='lb' />
			</div>
			<Button
				type='button'
				variant='default'
				className='px-10 text-base font-medium'
				onClick={handleClickNext}
			>
				Next
			</Button>
		</section>
	)
}
