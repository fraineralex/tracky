import { AboutMenuItem, SettingsMenuItem } from '~/types'
import { MenuItem } from './_components/menu-item'

const menuItems: SettingsMenuItem[] = [
	{
		name: 'birthday',
		label: 'Birthday',
		description: 'Update your date of birth',
		defaultValue: new Date(),
		group: 'Personal Information'
	},
	{
		name: 'sex',
		label: 'Sex',
		description: 'Update your biological sex',
		defaultValue: 'male',
		group: 'Personal Information'
	},
	{
		name: 'height',
		label: 'Height',
		description: 'Update your height',
		defaultValue: 170,
		group: 'Body Measurements'
	},
	{
		name: 'weight',
		label: 'Weight',
		description: 'Update your current weight',
		defaultValue: 70,
		group: 'Body Measurements'
	},
	{
		name: 'goalweight',
		label: 'Goal Weight',
		description: 'Set your goal weight',
		defaultValue: 65,
		group: 'Body Measurements'
	},
	{
		name: 'fat',
		label: 'Body Fat',
		description: 'Update your body fat percentage',
		defaultValue: 20,
		group: 'Body Measurements'
	},
	{
		name: 'activity',
		label: 'Activity',
		description: 'Update your activity level',
		defaultValue: 'moderate',
		group: 'Activity and Preferences'
	},
	{
		name: 'exercise',
		label: 'Exercise',
		description: 'Update your exercise frequency',
		defaultValue: 3,
		group: 'Activity and Preferences'
	},
	{
		name: 'cardio',
		label: 'Cardio',
		description: 'Update your cardio preference',
		defaultValue: 'medium',
		group: 'Activity and Preferences'
	},
	{
		name: 'lifting',
		label: 'Lifting',
		description: 'Update your lifting preference',
		defaultValue: 'medium',
		group: 'Activity and Preferences'
	},
	{
		name: 'goal',
		label: 'Goal',
		description: 'Set your fitness goal',
		defaultValue: 'maintain',
		group: 'Goals'
	},
	{
		name: 'progress',
		label: 'Goal Progress',
		description: 'View your goal progress',
		defaultValue: 0,
		group: 'Goals'
	}
]

const otherItems: AboutMenuItem[] = [
	{
		name: 'contact',
		label: 'Contact Us',
		description: 'Get in touch with technical support'
	},
	{
		name: 'about',
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
							<MenuItem menuItem={item} key={item.label} />
						))}
					</div>
				</div>
			))}
			<div className='mb-8'>
				<h2 className='mb-4 text-xl font-semibold'>Other</h2>
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{otherItems.map(item => (
						<MenuItem aboutMenuItem={item} key={item.label} />
					))}
				</div>
			</div>
			<p className='mt-8 text-center text-sm text-muted-foreground'>
				Version 1.0.0
			</p>
		</div>
	)
}
