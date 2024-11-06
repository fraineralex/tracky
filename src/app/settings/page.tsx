'use client'

import { JSX, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '~/components/ui/popover'
import { Slider } from '~/components/ui/slider'
import { Progress } from '~/components/ui/progress'

type MenuItem = {
	icon: React.ElementType
	label: string
	description: string
	schema: z.ZodTypeAny
	formFields: (form: ReturnType<typeof useForm>) => JSX.Element
	defaultValue: string | number | Date
	formatValue: (value: string | number | Date) => string
	group: string
}

const menuItems: MenuItem[] = [
	{
		icon: CalendarIcon,
		label: 'Birthday',
		description: 'Update your date of birth',
		schema: z.object({
			birthday: z.date({
				required_error: 'Please select a date'
			})
		}),
		formFields: (form: ReturnType<typeof useForm>) => (
			<FormField
				control={form.control}
				name='birthday'
				render={({ field }) => (
					<FormItem className='flex flex-col'>
						<FormLabel>Birthday</FormLabel>
						<Popover>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant={'outline'}
										className={cn(
											'w-full pl-3 text-left font-normal',
											!field.value && 'text-muted-foreground'
										)}
									>
										{field.value ? (
											format(field.value, 'PPP')
										) : (
											<span>Pick a date</span>
										)}
										<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className='w-auto p-0' align='start'>
								<Calendar
									mode='single'
									selected={field.value}
									onSelect={field.onChange}
									disabled={date =>
										date > new Date() || date < new Date('1900-01-01')
									}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
						<FormMessage />
					</FormItem>
				)}
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
		formFields: (form: ReturnType<typeof useForm>) => (
			<FormField
				control={form.control}
				name='sex'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Sex</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder='Select your sex' />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value='male'>Male</SelectItem>
								<SelectItem value='female'>Female</SelectItem>
								<SelectItem value='other'>Other</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
		),
		defaultValue: 'other',
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
		formFields: (form: ReturnType<typeof useForm>) => (
			<FormField
				control={form.control}
				name='height'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Height (cm)</FormLabel>
						<FormControl>
							<Input
								type='number'
								{...field}
								onChange={e => field.onChange(+e.target.value)}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
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
		formFields: (form: ReturnType<typeof useForm>) => (
			<FormField
				control={form.control}
				name='weight'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Weight (kg)</FormLabel>
						<FormControl>
							<Input
								type='number'
								{...field}
								onChange={e => field.onChange(+e.target.value)}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
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
		formFields: (form: ReturnType<typeof useForm>) => (
			<FormField
				control={form.control}
				name='goalWeight'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Goal Weight (kg)</FormLabel>
						<FormControl>
							<Input
								type='number'
								{...field}
								onChange={e => field.onChange(+e.target.value)}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
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
		formFields: (form: ReturnType<typeof useForm>) => (
			<FormField
				control={form.control}
				name='bodyFat'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Body Fat Percentage</FormLabel>
						<FormControl>
							<Slider
								min={0}
								max={100}
								step={1}
								value={[field.value]}
								onValueChange={vals => field.onChange(vals[0])}
							/>
						</FormControl>
						<FormDescription>Current value: {field.value}%</FormDescription>
						<FormMessage />
					</FormItem>
				)}
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
			activityLevel: z.enum([
				'sedentary',
				'light',
				'moderate',
				'active',
				'very_active'
			])
		}),
		formFields: (form: ReturnType<typeof useForm>) => (
			<FormField
				control={form.control}
				name='activityLevel'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Activity Level</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder='Select your activity level' />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value='sedentary'>Sedentary</SelectItem>
								<SelectItem value='light'>Light</SelectItem>
								<SelectItem value='moderate'>Moderate</SelectItem>
								<SelectItem value='active'>Active</SelectItem>
								<SelectItem value='very_active'>Very Active</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
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
		formFields: (form: ReturnType<typeof useForm>) => (
			<FormField
				control={form.control}
				name='exerciseFrequency'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Exercise Frequency (days per week)</FormLabel>
						<FormControl>
							<Slider
								min={0}
								max={7}
								step={1}
								value={[field.value]}
								onValueChange={vals => field.onChange(vals[0])}
							/>
						</FormControl>
						<FormDescription>Current value: {field.value} days</FormDescription>
						<FormMessage />
					</FormItem>
				)}
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
		formFields: (form: ReturnType<typeof useForm>) => (
			<FormField
				control={form.control}
				name='cardioPreference'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Cardio Preference</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder='Select cardio preference' />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value='low'>Low</SelectItem>
								<SelectItem value='medium'>Medium</SelectItem>
								<SelectItem value='high'>High</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
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
		formFields: (form: ReturnType<typeof useForm>) => (
			<FormField
				control={form.control}
				name='liftingPreference'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Lifting Preference</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder='Select lifting preference' />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value='low'>Low</SelectItem>
								<SelectItem value='medium'>Medium</SelectItem>
								<SelectItem value='high'>High</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
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
			goal: z.enum(['lose_weight', 'maintain_weight', 'gain_weight'])
		}),
		formFields: (form: ReturnType<typeof useForm>) => (
			<FormField
				control={form.control}
				name='goal'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Fitness Goal</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder='Select your goal' />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value='lose_weight'>Lose Weight</SelectItem>
								<SelectItem value='maintain_weight'>Maintain Weight</SelectItem>
								<SelectItem value='gain_weight'>Gain Weight</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
		),
		defaultValue: 'maintain_weight',
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
		formFields: (form: ReturnType<typeof useForm>) => (
			<FormField
				control={form.control}
				name='goalProgress'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Goal Progress</FormLabel>
						<FormControl>
							<Progress value={field.value} className='w-full' />
						</FormControl>
						<FormDescription>Current progress: {field.value}%</FormDescription>
					</FormItem>
				)}
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
		{} as Record<string, MenuItem[]>
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

function SettingsForm({
	item,
	onClose,
	onSave,
	initialValue
}: {
	item: MenuItem
	onClose: () => void
	onSave: (value: string | number | Date) => void
	initialValue: string | number | Date
}) {
	const form = useForm<z.infer<typeof item.schema>>({
		resolver: zodResolver(item.schema),
		defaultValues: {
			[item.label.toLowerCase()]: initialValue
		}
	})

	function onSubmit(values: z.infer<typeof item.schema>) {
		console.log(values)
		onSave(values[item.label.toLowerCase()])
		onClose()
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				{item.formFields(form)}
				{item.label !== 'Goal Progress' && (
					<Button type='submit'>Save Changes</Button>
				)}
			</form>
		</Form>
	)
}
