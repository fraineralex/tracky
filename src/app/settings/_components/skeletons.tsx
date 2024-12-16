import { SETTING_ICONS } from '~/constants'
import { Skeleton } from '~/components/ui/skeleton'

export async function SettingItemsSkeletonUI() {
	return (
		<>
			<div className='mb-8'>
				<h2 className='mb-4 text-lg font-semibold'>Personal Information</h2>
				<div className='grid grid-cols-2 gap-4 lg:grid-cols-3'>
					<MenuItemSkeletonUI name='born' label='Born Date' />
					<MenuItemSkeletonUI name='sex' label='Sex' />
					<MenuItemSkeletonUI name='activity' label='Activity' />

					<MenuItemSkeletonUI name='height' label='Height' />
					<MenuItemSkeletonUI name='weights' label='Weight' />
					<MenuItemSkeletonUI name='fat' label='Body Fat' />
				</div>
			</div>
			<div className='mb-8'>
				<h2 className='mb-4 text-lg font-semibold'>Preferences and Goals</h2>
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					<MenuItemSkeletonUI name='goal' label='Goal' />
					<MenuItemSkeletonUI name='goalWeight' label='Goal Weight' />
					<MenuItemSkeletonUI name='progress' label='Goal Progress' />
				</div>
			</div>
			<div className='mb-8'>
				<h2 className='mb-4 text-lg font-semibold'>Support and Information</h2>
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					<MenuItemSkeletonUI
						name='mail'
						label='Contact Us'
						value='Get in touch with technical support'
					/>
					<MenuItemSkeletonUI
						name='about'
						label='About'
						value='Learn more about the app'
					/>
					<MenuItemSkeletonUI
						name='healt'
						label='Health Disclaimer'
						value='Understand the health guidelines'
					/>
				</div>
			</div>
			<p className='mt-8 text-center text-sm text-muted-foreground'>
				Version 1.0.0
			</p>
		</>
	)
}

export function MenuItemSkeletonUI({
	name,
	label,
	value
}: {
	name: string
	label: string
	value?: string
}) {
	const Icon = SETTING_ICONS[name as keyof typeof SETTING_ICONS]
	return (
		<span className='inline-flex h-auto w-full items-center justify-start whitespace-nowrap rounded-md border border-input bg-background px-4 py-4 text-sm font-medium shadow-sm transition-colors'>
			<Icon className='mr-2 h-5 w-5' />
			<div className='flex flex-col items-start'>
				<span className='font-medium'>{label}</span>
				{value ? (
					<span className='text-sm capitalize text-muted-foreground'>
						{value}
					</span>
				) : (
					<Skeleton className='mt-[7px] h-3 w-20 md:w-28' />
				)}
			</div>
		</span>
	)
}
