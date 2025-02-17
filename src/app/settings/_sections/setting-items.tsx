import { MenuItem } from '../_components/menu-item'
import { ACTIVITY_LEVELS } from '~/constants'
import { BriefcaseMedical, Info, Mail } from 'lucide-react'
import { Button } from '~/components/ui/button'
import Link from 'next/link'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'
import {
	calculateBodyFat,
	calculateGoalProgress,
	round
} from '~/lib/calculations'
import { currentUser } from '@clerk/nextjs/server'
import { SettingItemsSkeletonUI } from '../_components/skeletons'

export async function SettingItems() {
	const user = await currentUser()
	if (!user) return <SettingItemsSkeletonUI />
	const userMetadata = user?.publicMetadata
	const currentWeight =
		userMetadata.weights[userMetadata.weights.length - 1]?.value ?? 0
	const goalProgress = calculateGoalProgress(userMetadata)
	return (
		<>
			<div className='mb-8'>
				<h2 className='mb-4 text-lg font-semibold'>Personal Information</h2>
				<div className='grid grid-cols-2 gap-4 lg:grid-cols-3'>
					<MenuItem
						name='born'
						label='Born'
						attr={{
							name: 'born',
							label: 'Born Date',
							type: 'date',
							value: new Date(userMetadata.born)
						}}
					/>
					<MenuItem
						name='sex'
						label='Sex'
						attr={{
							name: 'sex',
							label: 'Sex',
							type: 'select',
							options: ['male', 'female'],
							value: userMetadata.sex
						}}
					/>
					<MenuItem
						name='activity'
						label='Activity'
						attr={{
							name: 'activity',
							label: 'Activity Level',
							type: 'select',
							options: Object.keys(ACTIVITY_LEVELS),
							value:
								userMetadata.activity[userMetadata.activity.length - 1]
									?.value || 'sedentary'
						}}
					/>

					<MenuItem
						name='height'
						label='Height'
						attr={{
							name: 'height',
							label: 'Height',
							type: 'number',
							placeholder: 'Enter your height',
							value:
								userMetadata.height[userMetadata.height.length - 1]?.value || 0
						}}
					/>
					<MenuItem
						name='weights'
						label='Weight'
						attr={{
							name: 'weights',
							label: 'Weight',
							type: 'number',
							placeholder: 'Enter your weight',
							value: currentWeight
						}}
					/>
					<MenuItem
						name='fat'
						label='Body Fat'
						attr={{
							name: 'fat',
							label: 'Body Fat Percentage (%)',
							placeholder: 'Enter your body fat',
							type: 'range',
							min: 0,
							max: 50,
							value: round(
								userMetadata.fat[userMetadata.fat.length - 1]?.value ||
									calculateBodyFat(userMetadata),
								1
							)
						}}
					/>
				</div>
			</div>
			<div className='mb-8'>
				<h2 className='mb-4 text-lg font-semibold'>Preferences and Goals</h2>
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					<MenuItem
						name='goal'
						label='Goal'
						attr={{
							name: 'goal',
							label: 'Fitness Goal',
							type: 'select',
							options: ['maintain', 'lose', 'gain'],
							value: userMetadata.goal[userMetadata.goal.length - 1]?.value || 0
						}}
					/>
					<MenuItem
						name='goalWeight'
						label='Goal Weight'
						attr={{
							name: 'goalWeight',
							label: 'Goal Weight',
							type: 'number',
							placeholder: 'Enter your goal weight',
							value:
								userMetadata.goalWeight[userMetadata.goalWeight.length - 1]
									?.value || 0
						}}
					/>
					<MenuItem
						name='progress'
						label='Goal Progress'
						attr={{
							name: 'progress',
							label: 'Goal Progress',
							type: 'range',
							min: 0,
							max: 100,
							value: goalProgress
						}}
					/>
				</div>
			</div>
			<div className='mb-8'>
				<h2 className='mb-4 text-lg font-semibold'>Support and Information</h2>
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					<Button
						variant='outline'
						className='h-auto w-full justify-start px-4 py-4'
						asChild
					>
						<Link href={`mailto:frainerdeveloper@gmail.com`}>
							<Mail className='mr-2 h-5 w-5' />
							<div className='flex flex-col items-start'>
								<span className='font-medium'>Reach out</span>
								<span className='text-sm text-muted-foreground'>
									Get technical support
								</span>
							</div>
						</Link>
					</Button>
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant='outline'
								className='h-auto w-full justify-start px-4 py-4'
							>
								<Info className='mr-2 h-5 w-5' />
								<div className='flex flex-col items-start'>
									<span className='font-medium'>About</span>
									<span className='text-sm text-muted-foreground'>
										Learn more about Tracky
									</span>
								</div>
							</Button>
						</DialogTrigger>
						<DialogContent className='max-w-[95%] rounded-lg sm:max-w-96 md:max-w-128'>
							<DialogHeader>
								<DialogTitle>About</DialogTitle>
							</DialogHeader>

							<div>
								<p>
									<span className='font-serif text-lg font-bold text-green-600 dark:text-green-500'>
										trac
										<span className='text-wood-950 dark:text-wood-100'>ky</span>
									</span>{' '}
									is a free fitness tracking web app with AI-powered features to
									quickly log meals and exercises, helping you stay healthy and
									fit.
								</p>
								<p className='mt-4'>
									Whether you&apos;re aiming to lose weight, build muscle, or
									maintain a healthy lifestyle. Tracky makes tracking your
									progress simple and efficient.
								</p>
								<p className='mt-4'>
									Build by{' '}
									<a
										href='https://x.com/fraineralex'
										className='text-blue-500'
										rel='noopener noreferrer'
										target='_blank'
									>
										fraineralex
									</a>
									. Source code available on{' '}
									<a
										href='https://github.com/fraineralex/tracky'
										className='text-blue-500'
										rel='noopener noreferrer'
										target='_blank'
									>
										Github
									</a>
									.
								</p>
								<p className='mt-8 text-center text-sm text-muted-foreground'>
									Version 1.0.0
								</p>
							</div>
						</DialogContent>
					</Dialog>
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant='outline'
								className='h-auto w-full justify-start px-4 py-4'
							>
								<BriefcaseMedical className='mr-2 h-5 w-5' />
								<div className='flex flex-col items-start'>
									<span className='font-medium'>Health Disclaimer</span>
									<span className='text-sm text-muted-foreground'>
										Understand the health guidelines
									</span>
								</div>
							</Button>
						</DialogTrigger>
						<DialogContent className='max-w-[95%] rounded-lg sm:max-w-96 md:max-w-128'>
							<DialogHeader>
								<DialogTitle>Health Disclaimer</DialogTitle>
							</DialogHeader>

							<div>
								<p>
									<span className='font-serif text-lg font-bold text-green-600 dark:text-green-500'>
										trac
										<span className='text-wood-950 dark:text-wood-100'>ky</span>
									</span>{' '}
									provides health and fitness tracking for informational
									purposes only. It is not a substitute for professional medical
									advice, diagnosis, or treatment.
								</p>
								<p className='mt-4'>
									Always consult with a healthcare provider before starting any
									new fitness or health regimen. Discontinue use immediately if
									you experience discomfort or adverse effects, and seek medical
									attention.
								</p>
								<p className='mt-8 text-center text-sm text-muted-foreground'>
									Stay safe while using{' '}
									<span className='font-serif font-bold text-green-600 dark:text-green-500'>
										trac
										<span className='text-wood-950 dark:text-wood-100'>ky</span>
									</span>{' '}
									💚
								</p>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<p className='mt-8 text-center text-sm text-muted-foreground'>
				Version 1.0.0
			</p>
		</>
	)
}
