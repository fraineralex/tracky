'use client'

import { useState } from 'react'
import * as z from 'zod'
import { format } from 'date-fns'
import {
	Calendar as CalendarIcon,
	User,
	Ruler,
	Activity,
	Dumbbell,
	Heart,
	Weight,
	Target,
	Flag,
	Mail,
	Info
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'
import { SettingsMenuItem } from '~/types'
import { SettingsForm } from './_components/form'
import { SettingsField } from './_components/settings-field'
import { ACTIVITY_LEVELS } from '~/constants'

const menuItems: SettingsMenuItem[] = [
	{
		icon: CalendarIcon,
		label: 'Birthday',
		description: 'Update your date of birth',
		schema: z.object({
			birthday: z.date({
				required_error: 'Please select a date'
			})
		}),
		formFields: form => (
			<SettingsField
				form={form}
				attr={{ name: 'birthday', label: 'Birthday', type: 'date' }}
			/>
		),
		defaultValue: new Date(),
		formatValue: value => format(value, 'PPP'),
		group: 'Personal Information'
	},
	{
		icon: User,
		label: 'Sex',
		description: 'Update your biological sex',
		schema: z.object({
			sex: z.enum(['male', 'female', 'other'])
		}),
		formFields: form => (
			<SettingsField
				form={form}
				attr={{
					name: 'sex',
					label: 'Sex',
					type: 'select',
					options: ['Male', 'Female']
				}}
			/>
		),
		defaultValue: 'male',
		formatValue: value =>
			typeof value === 'string'
				? value.charAt(0).toUpperCase() + value.slice(1)
				: '',
		group: 'Personal Information'
	},
	{
		icon: Ruler,
		label: 'Height',
		description: 'Update your height',
		schema: z.object({
			height: z.number().min(100).max(250)
		}),
		formFields: form => (
			<SettingsField
				form={form}
				attr={{
					name: 'height',
					label: 'Height (ft)',
					type: 'number',
					placeholder: 'Enter your height'
				}}
			/>
		),
		defaultValue: 170,
		formatValue: value =>
			`${value} cm`.charAt(0).toUpperCase() + `${value} cm`.slice(1),
		group: 'Body Measurements'
	},
	{
		icon: Weight,
		label: 'Weight',
		description: 'Update your current weight',
		schema: z.object({
			weight: z.number().min(30).max(300)
		}),
		formFields: form => (
			<SettingsField
				form={form}
				attr={{
					name: 'weight',
					label: 'Weight (kg)',
					type: 'number',
					placeholder: 'Enter your weight'
				}}
			/>
		),
		defaultValue: 70,
		formatValue: value =>
			`${value} kg`.charAt(0).toUpperCase() + `${value} kg`.slice(1),
		group: 'Body Measurements'
	},
	{
		icon: Target,
		label: 'Goal Weight',
		description: 'Set your goal weight',
		schema: z.object({
			goalWeight: z.number().min(30).max(300)
		}),
		formFields: form => (
			<SettingsField
				form={form}
				attr={{
					name: 'goalWeight',
					label: 'Goal Weight (kg)',
					type: 'number',
					placeholder: 'Enter your goal weight'
				}}
			/>
		),
		defaultValue: 65,
		formatValue: value =>
			`${value} kg`.charAt(0).toUpperCase() + `${value} kg`.slice(1),
		group: 'Body Measurements'
	},
	{
		icon: Weight,
		label: 'Body Fat',
		description: 'Update your body fat percentage',
		schema: z.object({
			bodyFat: z.number().min(0).max(100)
		}),
		formFields: form => (
			<SettingsField
				form={form}
				attr={{
					name: 'bodyFat',
					label: 'Body Fat Percentage',
					type: 'range',
					min: 0,
					max: 100
				}}
			/>
		),
		defaultValue: 20,
		formatValue: value =>
			`${value}%`.charAt(0).toUpperCase() + `${value}%`.slice(1),
		group: 'Body Measurements'
	},
	{
		icon: Activity,
		label: 'Activity',
		description: 'Update your activity level',
		schema: z.object({
			activityLevel: z.enum([...Object.keys(ACTIVITY_LEVELS)] as [
				string,
				...string[]
			])
		}),
		formFields: form => (
			<SettingsField
				form={form}
				attr={{
					name: 'activityLabel',
					label: 'Activity Label',
					type: 'select',
					options: Object.keys(ACTIVITY_LEVELS)
				}}
			/>
		),
		defaultValue: 'moderate',
		formatValue: value =>
			typeof value === 'string'
				? value.charAt(0).toUpperCase() + value.slice(1)
				: value.toString(),
		group: 'Activity and Preferences'
	},
	{
		icon: Dumbbell,
		label: 'Exercise',
		description: 'Update your exercise frequency',
		schema: z.object({
			exerciseFrequency: z.number().min(0).max(7)
		}),
		formFields: form => (
			<SettingsField
				form={form}
				attr={{
					name: 'exerciseFrequency',
					label: 'Exercise Frequency',
					type: 'range',
					min: 1,
					max: 7
				}}
			/>
		),
		defaultValue: 3,
		formatValue: value =>
			`${value} days/week`.charAt(0).toUpperCase() +
			`${value} days/week`.slice(1),
		group: 'Activity and Preferences'
	},
	{
		icon: Heart,
		label: 'Cardio',
		description: 'Update your cardio preference',
		schema: z.object({
			cardioPreference: z.enum(['low', 'medium', 'high'])
		}),
		formFields: form => (
			<SettingsField
				form={form}
				attr={{
					name: 'cardioPreference',
					label: 'Cardio Preference',
					type: 'select',
					options: ['low', 'medium', 'high']
				}}
			/>
		),
		defaultValue: 'medium',
		formatValue: value =>
			typeof value === 'string'
				? value.charAt(0).toUpperCase() + value.slice(1)
				: value.toString(),
		group: 'Activity and Preferences'
	},
	{
		icon: Dumbbell,
		label: 'Lifting',
		description: 'Update your lifting preference',
		schema: z.object({
			liftingPreference: z.enum(['low', 'medium', 'high'])
		}),
		formFields: form => (
			<SettingsField
				form={form}
				attr={{
					name: 'liftingPreference',
					label: 'Lifting Preference',
					type: 'select',
					options: ['low', 'medium', 'high']
				}}
			/>
		),

		defaultValue: 'medium',
		formatValue: value =>
			typeof value === 'string'
				? value.charAt(0).toUpperCase() + value.slice(1)
				: value.toString(),
		group: 'Activity and Preferences'
	},
	{
		icon: Flag,
		label: 'Goal',
		description: 'Set your fitness goal',
		schema: z.object({
			goal: z.enum(['lose', 'maintain', 'gain'])
		}),
		formFields: form => (
			<SettingsField
				form={form}
				attr={{
					name: 'goal',
					label: 'Fitnes Goal',
					type: 'select',
					placeholder: 'Select your goal',
					options: [
						{ key: 'lose', label: 'Lose Weight' },
						{ key: 'maintain', label: 'Maintain Weight' },
						{ key: 'gain', label: 'Gain Weight' }
					]
				}}
			/>
		),
		defaultValue: 'maintain',
		formatValue: value =>
			typeof value === 'string'
				? value.replace('_', ' ').charAt(0).toUpperCase() +
					value.replace('_', ' ').slice(1)
				: value.toString(),
		group: 'Goals'
	},
	{
		icon: Target,
		label: 'Goal Progress',
		description: 'View your goal progress',
		schema: z.object({
			goalProgress: z.number().min(0).max(100)
		}),
		formFields: form => (
			<SettingsField
				form={form}
				attr={{
					name: 'goalProgress',
					label: 'Goal Progress',
					type: 'range'
				}}
			/>
		),
		defaultValue: 0,
		formatValue: value =>
			`${value}%`.charAt(0).toUpperCase() + `${value}%`.slice(1),
		group: 'Goals'
	}
]

const otherItems = [
	{
		icon: Mail,
		label: 'Contact Us',
		description: 'Get in touch with  technical support',
		action: () => (window.location.href = 'mailto:support@fitnessapp.com')
	},
	{
		icon: Info,
		label: 'About',
		description: 'Learn more about our app',
		content: (
			<div>
				<p>
					Fitness App is your personal health and fitness companion. We&apos;re
					dedicated to helping you achieve your fitness goals, whether
					you&apos;re looking to lose weight, build muscle, or maintain a
					healthy lifestyle.
				</p>
				<p className='mt-4'>
					Our app provides personalized workout plans, nutrition tracking, and
					progress monitoring to keep you motivated and on track.
				</p>
			</div>
		)
	}
]

export default function SettingsPageWithModalsComponent() {
	const [openModal, setOpenModal] = useState<string | null>(null)
	const [settings, setSettings] = useState(() => {
		return Object.fromEntries(
			menuItems.map(item => [item.label.toLowerCase(), item.defaultValue])
		)
	})

	const groupedMenuItems = menuItems.reduce(
		(acc, item) => {
			if (!acc[item.group]) {
				acc[item.group] = []
			}
			acc[item.group]?.push(item)
			return acc
		},
		{} as Record<string, SettingsMenuItem[]>
	)

	return (
		<div className='container mx-auto max-w-7xl p-6'>
			<h1 className='mb-6 text-2xl font-bold'>Settings</h1>
			{Object.entries(groupedMenuItems).map(([group, items]) => (
				<div key={group} className='mb-8'>
					<h2 className='mb-4 text-xl font-semibold'>{group}</h2>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{items.map(item => (
							<Dialog
								key={item.label}
								open={openModal === item.label}
								onOpenChange={isOpen =>
									setOpenModal(isOpen ? item.label : null)
								}
							>
								<DialogTrigger asChild>
									<Button
										variant='outline'
										className='h-auto w-full justify-start px-4 py-4'
									>
										<item.icon className='mr-2 h-5 w-5' />
										<div className='flex flex-col items-start'>
											<span className='font-medium'>{item.label}</span>
											<span className='text-sm text-muted-foreground'>
												{item.formatValue(
													settings[item.label.toLowerCase()] ?? ''
												)}
											</span>
										</div>
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>{item.label}</DialogTitle>
									</DialogHeader>
									<SettingsForm
										item={item}
										onClose={() => setOpenModal(null)}
										onSave={value => {
											setSettings(prev => ({
												...prev,
												[item.label.toLowerCase()]: value
											}))
										}}
										initialValue={
											settings[item.label.toLowerCase()] ?? item.defaultValue
										}
									/>
								</DialogContent>
							</Dialog>
						))}
					</div>
				</div>
			))}
			<div className='mb-8'>
				<h2 className='mb-4 text-xl font-semibold'>Other</h2>
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{otherItems.map(item => (
						<Dialog
							key={item.label}
							open={openModal === item.label}
							onOpenChange={isOpen => setOpenModal(isOpen ? item.label : null)}
						>
							<DialogTrigger asChild>
								<Button
									variant='outline'
									className='h-auto w-full justify-start px-4 py-4'
									onClick={item.action}
								>
									<item.icon className='mr-2 h-5 w-5' />
									<div className='flex flex-col items-start'>
										<span className='font-medium'>{item.label}</span>
										<span className='text-sm text-muted-foreground'>
											{item.description}
										</span>
									</div>
								</Button>
							</DialogTrigger>
							{item.content && (
								<DialogContent>
									<DialogHeader>
										<DialogTitle>{item.label}</DialogTitle>
									</DialogHeader>
									{item.content}
								</DialogContent>
							)}
						</Dialog>
					))}
				</div>
			</div>
			<p className='mt-8 text-center text-sm text-muted-foreground'>
				Version 1.0.0
			</p>
		</div>
	)
}
