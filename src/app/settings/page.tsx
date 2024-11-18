import { format } from 'date-fns'
import { MenuItem } from './_components/menu-item'
import { ACTIVITY_LEVELS } from '~/constants'
import {
	Activity,
	CalendarIcon,
	Dumbbell,
	Flag,
	Heart,
	Info,
	Mail,
	Percent,
	PersonStanding,
	Ruler,
	Target,
	User,
	Weight
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import Link from 'next/link'

export default function SettingsPageWithModalsComponent() {
	return (
		<div className='container mx-auto max-w-7xl p-6'>
			<h1 className='mb-6 text-2xl font-bold'>Settings</h1>
			<form>
				<div className='mb-8'>
					<h2 className='mb-4 text-lg font-semibold'>Personal Information</h2>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						<MenuItem
							name='birthday'
							label='Birthday'
							description='Update your date of birth'
							attr={{
								name: 'birthday',
								label: 'Birthday',
								type: 'date',
								value: new Date()
							}}
							displayValue={format(new Date(), 'PPP')}
							Icon={CalendarIcon}
						/>
						<MenuItem
							name='sex'
							label='Sex'
							description='Update your biological sex'
							attr={{
								name: 'sex',
								label: 'Sex',
								type: 'select',
								options: ['male', 'female'],
								value: 'male'
							}}
							Icon={User}
						/>
						<MenuItem
							name='activity'
							label='Activity'
							description='Update your activity level'
							attr={{
								name: 'activity',
								label: 'Activity Level',
								type: 'select',
								options: Object.keys(ACTIVITY_LEVELS),
								value: 'moderate'
							}}
							Icon={Activity}
						/>

						<MenuItem
							name='height'
							label='Height'
							description='Update your height'
							attr={{
								name: 'height',
								label: 'Height (ft)',
								type: 'number',
								placeholder: 'Enter your height',
								value: 170
							}}
							displayValue='6′2 ft'
							Icon={Ruler}
						/>
						<MenuItem
							name='weight'
							label='Weight'
							description='Update your weight'
							attr={{
								name: 'weight',
								label: 'Weight (kg)',
								type: 'number',
								placeholder: 'Enter your weight',
								value: 170
							}}
							displayValue='97.8 kg'
							Icon={Weight}
						/>
						<MenuItem
							name='fat'
							label='Body Fat'
							description='Update your body fat percentage'
							attr={{
								name: 'fat',
								label: 'Body Fat Percentage (%)',
								placeholder: 'Enter your body fat',
								type: 'range',
								min: 0,
								max: 50,
								value: 20
							}}
							displayValue='20%'
							Icon={Percent}
						/>
					</div>
				</div>
				<div className='mb-8'>
					<h2 className='mb-4 text-lg font-semibold'>Preferences and Goals</h2>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						<MenuItem
							name='exercise'
							label='Exercise'
							description='Update your exercise frequency'
							attr={{
								name: 'exercise',
								label: 'Exercise Frequency',
								placeholder: 'Enter your exercise frequency',
								type: 'range',
								min: 1,
								max: 7,
								value: 3
							}}
							displayValue='3 times per week'
							Icon={PersonStanding}
						/>
						<MenuItem
							name='cardio'
							label='Cardio'
							description='Update your cardio preference'
							attr={{
								name: 'cardio',
								label: 'Cardio Preference',
								type: 'select',
								options: ['light', 'medium', 'heavy'],
								value: 'medium'
							}}
							Icon={Heart}
						/>
						<MenuItem
							name='lifting'
							label='Lifting'
							description='Update your lifting preference'
							attr={{
								name: 'lifting',
								label: 'Lifting Preference',
								type: 'select',
								options: ['light', 'medium', 'heavy'],
								value: 'medium'
							}}
							Icon={Dumbbell}
						/>

						<MenuItem
							name='goal'
							label='Goal'
							description='Set your fitness goal'
							attr={{
								name: 'goal',
								label: 'Fitness Goal',
								type: 'select',
								options: ['maintain', 'lose', 'gain'],
								value: 'gain'
							}}
							Icon={Flag}
						/>
						<MenuItem
							name='goalweight'
							label='Goal Weight'
							description='Update your goal weight'
							attr={{
								name: 'goalweight',
								label: 'Goal Weight (kg)',
								type: 'number',
								placeholder: 'Enter your goal weight',
								value: 100
							}}
							displayValue='100 kg'
							Icon={Weight}
						/>
						<MenuItem
							name='progress'
							label='Goal Progress'
							description='View your goal progress'
							attr={{
								name: 'progress',
								label: 'Goal Progress',
								type: 'range',
								min: 0,
								max: 100,
								value: 70
							}}
							displayValue='70%'
							Icon={Target}
						/>
					</div>
				</div>
				<div className='mb-8'>
					<h2 className='mb-4 text-lg font-semibold'>
						Support and Information
					</h2>
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
						<MenuItem
							name='about'
							label='About'
							description='Learn more about the app'
							content={
								<div>
									<p>
										Tracky is your personal health and fitness companion.
										We&apos;re dedicated to helping you achieve your fitness
										goals, whether you&apos;re looking to lose weight, build
										muscle, or maintain a healthy lifestyle.
									</p>
									<p className='mt-4'>
										Tracky provides personalized workout plans, nutrition
										tracking, and progress monitoring to keep you motivated and
										on track.
									</p>
									<p className='mt-8 text-center text-sm text-muted-foreground'>
										Version 1.0.0
									</p>
								</div>
							}
							Icon={Info}
						/>
					</div>
				</div>
			</form>
			<p className='mt-8 text-center text-sm text-muted-foreground'>
				Version 1.0.0
			</p>
		</div>
	)
}
