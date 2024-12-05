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
import { calculateBodyFat, round } from '~/lib/calculations'

export function Settings({
	userMetadata,
	currentWeight,
	goalProgress
}: {
	userMetadata: UserPublicMetadata
	currentWeight: number
	goalProgress: number
}) {
	return (
		<div className='container mx-auto py-5'>
			<header className='mb-8 flex flex-col gap-1'>
				<h1 className='text-2xl font-bold'>Settings</h1>
				<h2 className='text-sm text-muted-foreground'>
					Configure the settings for this application
				</h2>
			</header>
			<div className='mb-8'>
				<h2 className='mb-4 text-lg font-semibold'>Personal Information</h2>
				<div className='grid grid-cols-2 gap-4 lg:grid-cols-3'>
					<MenuItem
						name='born'
						label='Born Date'
						attr={{
							name: 'born',
							label: 'Born Date',
							type: 'date',
							value: userMetadata.born
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
							value: userMetadata.activity
						}}
					/>

					<MenuItem
						name='height'
						label='Height'
						attr={{
							name: 'height',
							label: 'Height',
							unit: userMetadata.heightUnit,
							type: 'number',
							placeholder: 'Enter your height',
							value: userMetadata.height
						}}
					/>
					<MenuItem
						name='weights'
						label='Weight'
						attr={{
							name: 'weights',
							label: 'Weight',
							unit: userMetadata.weightUnit,
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
								userMetadata.fat || calculateBodyFat(userMetadata),
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
							value: userMetadata.goal
						}}
					/>
					<MenuItem
						name='goalWeight'
						label='Goal Weight'
						attr={{
							name: 'goalWeight',
							label: 'Goal Weight',
							unit: userMetadata.weightUnit,
							type: 'number',
							placeholder: 'Enter your goal weight',
							value: userMetadata.goalWeight
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
								<span className='font-medium'>Contact Us</span>
								<span className='text-sm text-muted-foreground'>
									Get in touch with technical support
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
									<span className='text-sm capitalize text-muted-foreground'>
										Learn more about the app
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
									Tracky is your personal health and fitness companion.
									We&apos;re dedicated to helping you achieve your fitness
									goals, whether you&apos;re looking to lose weight, build
									muscle, or maintain a healthy lifestyle.
								</p>
								<p className='mt-4'>
									Tracky provides personalized workout plans, nutrition
									tracking, and progress monitoring to keep you motivated and on
									track.
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
									<span className='text-sm capitalize text-muted-foreground'>
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
									Tracky provides health and fitness tracking for informational
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
									Stay safe while using Tracky. 💚
								</p>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<p className='mt-8 text-center text-sm text-muted-foreground'>
				Version 1.0.0
			</p>
		</div>
	)
}
