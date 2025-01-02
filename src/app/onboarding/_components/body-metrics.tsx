import { Input } from '~/components/ui/input'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'
import { Button } from '~/components/ui/button'
import { ONBOARDING_SECTIONS } from '~/constants'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { STAGGER_CHILD_VARIANTS } from '~/constants'

export default function BodyMetrics({
	setShowSection,
	height,
	weight,
	showSection,
	setFitnessGoalsEntry
}: {
	setShowSection: (section: string) => void
	height: {
		value: number
		setValue: (height: number) => void
		unit: string
		setUnit: (unit: string) => void
		decimal: number
		setDecimal: (decimal: number) => void
	}
	weight: {
		value: number
		setValue: (weight: number) => void
		unit: string
		setUnit: (unit: string) => void
	}
	showSection: boolean
	setFitnessGoalsEntry: (entry: boolean) => void
}) {
	let heightLength = height.unit === 'ft' ? 8 : 250
	if (height.unit === 'm') heightLength = 2

	const decimalLength = height.unit === 'ft' ? 11 : 99

	const handleClickNext = () => {
		if (height.value && weight.value) {
			setShowSection(ONBOARDING_SECTIONS.goals)
			setFitnessGoalsEntry(true)
		}
	}

	return (
		<motion.section
			variants={{
				hidden: { opacity: 0, scale: 0.95 },
				show: { opacity: 1, scale: 1, transition: { staggerChildren: 0.2 } }
			}}
			initial='hidden'
			animate='show'
			exit='hidden'
			transition={{ duration: 0.3, type: 'spring' }}
		>
			<div
				className={`z-10 mx-5  ${showSection ? 'flex' : 'hidden'} flex-col items-center space-y-16 text-center sm:mx-auto`}
			>
				<div className='space-y-10'>
					<motion.article variants={STAGGER_CHILD_VARIANTS}>
						<h2 className='font-display mb-1 max-w-md text-start text-sm font-semibold transition-colors'>
							What is your height?
						</h2>
						<div
							className={`flex items-center ${height.unit === 'cm' ? 'space-x-2' : 'space-x-3'}`}
						>
							<span className='flex items-center space-x-1'>
								<Select
									name='height'
									defaultValue={height.value.toString()}
									required
									onValueChange={value => height.setValue(Number(value))}
								>
									<SelectTrigger
										className={`${height.unit === 'cm' ? 'w-[180px]' : 'w-[80px]'} border-gray-400`}
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
								{height.unit !== 'cm' && (
									<>
										<p
											className={`${height.unit === 'ft' ? '-mt-5' : 'mt-5'} font-semibold`}
										>
											{height.unit === 'ft' ? '″' : '.'}
										</p>
										<Select
											name='heightDecimal'
											defaultValue={height.decimal.toString()}
											required
											onValueChange={value => height.setDecimal(Number(value))}
										>
											<SelectTrigger className='w-[80px] border-gray-400'>
												<SelectValue placeholder={height.decimal.toString()} />
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
								defaultValue={height.unit}
								onValueChange={value => height.setUnit(value)}
							>
								<SelectTrigger className='w-[80px] border-gray-400'>
									<SelectValue placeholder={height.unit} />
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
					</motion.article>
					<motion.article variants={STAGGER_CHILD_VARIANTS}>
						<h2 className='font-display mb-1 max-w-md text-start text-sm font-semibold transition-colors'>
							What is your weight?
						</h2>
						<div className='flex items-center space-x-2'>
							<Input
								type='number'
								name='weight'
								placeholder='weight'
								className='w-[180px] border-gray-400 focus:border-gray-300'
								required
								onChange={e => weight.setValue(Number(e.target.value))}
								value={weight.value > 0 ? weight.value : ''}
								min={0}
								max={weight.unit === 'lb' ? 500 : 250}
							/>
							<Select
								name='weightUnit'
								defaultValue={weight.unit}
								onValueChange={value => weight.setUnit(value)}
							>
								<SelectTrigger className='w-[80px] border-gray-400'>
									<SelectValue placeholder={weight.unit} />
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
					</motion.article>
				</div>
				<motion.footer variants={STAGGER_CHILD_VARIANTS}>
					<div className='flex w-full justify-between'>
						<Button
							type='button'
							variant='secondary'
							className='text-base font-medium'
							onClick={() => setShowSection(ONBOARDING_SECTIONS.personal)}
						>
							<ChevronLeft />
						</Button>
						<Button
							type='button'
							variant={`${height.value && weight.value ? 'default' : 'secondary'}`}
							className='text-base font-medium'
							onClick={handleClickNext}
							disabled={!height.value || !weight.value}
						>
							<ChevronRight />
						</Button>
					</div>
				</motion.footer>
			</div>
		</motion.section>
	)
}
