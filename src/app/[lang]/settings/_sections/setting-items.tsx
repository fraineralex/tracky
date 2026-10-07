import { MenuItem } from '../_components/menu-item'
import { ACTIVITY_LEVELS, SUPPORT_EMAIL } from '~/constants'
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
import { resolveUserProfile } from '~/server/user-profile'
import type { Dictionary } from '~/get-dictionary'

interface SettingItemsProps {
	dictionary: Dictionary
}

export async function SettingItems({ dictionary }: SettingItemsProps) {
	const user = await currentUser()
	if (!user) return <SettingItemsSkeletonUI />
	const userMetadata = await resolveUserProfile(user.id, user.publicMetadata)
	if (!userMetadata) return <SettingItemsSkeletonUI />
	const currentWeight =
		userMetadata.weights[userMetadata.weights.length - 1]?.value ?? 0
	const goalProgress = calculateGoalProgress(userMetadata)
	const t = dictionary.settings
	return (
		<>
			<div className='mb-8'>
				<h2 className='mb-4 text-lg font-semibold'>
					{t.sections.personalInfo}
				</h2>
				<div className='grid grid-cols-2 gap-4 lg:grid-cols-3'>
					<MenuItem
						name='born'
						label={t.fields.born}
						attr={{
							name: 'born',
							label: t.fields.bornDate,
							type: 'date',
							value: new Date(userMetadata.born)
						}}
					/>
					<MenuItem
						name='sex'
						label={t.fields.sex}
						attr={{
							name: 'sex',
							label: t.fields.sex,
							type: 'select',
							options: ['male', 'female'],
							optionLabels: {
								male: t.sexOptions.male,
								female: t.sexOptions.female
							},
							value: userMetadata.sex
						}}
					/>
					<MenuItem
						name='activity'
						label={t.fields.activity}
						attr={{
							name: 'activity',
							label: t.fields.activityLevel,
							type: 'select',
							options: Object.keys(ACTIVITY_LEVELS),
							value:
								userMetadata.activity[userMetadata.activity.length - 1]
									?.value ?? 'sedentary'
						}}
					/>

					<MenuItem
						name='height'
						label={t.fields.height}
						attr={{
							name: 'height',
							label: t.fields.height,
							type: 'number',
							placeholder: t.placeholders.enterHeight,
							value:
								userMetadata.height[userMetadata.height.length - 1]?.value ?? 0
						}}
					/>
					<MenuItem
						name='weights'
						label={t.fields.weight}
						attr={{
							name: 'weights',
							label: t.fields.weight,
							type: 'number',
							placeholder: t.placeholders.enterWeight,
							value: currentWeight
						}}
					/>
					<MenuItem
						name='fat'
						label={t.fields.bodyFat}
						attr={{
							name: 'fat',
							label: t.fields.bodyFatPercentage,
							placeholder: t.placeholders.enterBodyFat,
							type: 'range',
							min: 0,
							max: 50,
							value: round(
								userMetadata.fat[userMetadata.fat.length - 1]?.value ??
									calculateBodyFat(userMetadata),
								1
							)
						}}
					/>
				</div>
			</div>
			<div className='mb-8'>
				<h2 className='mb-4 text-lg font-semibold'>
					{t.sections.preferencesGoals}
				</h2>
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					<MenuItem
						name='goal'
						label={t.fields.goal}
						attr={{
							name: 'goal',
							label: t.fields.fitnessGoal,
							type: 'select',
							options: ['maintain', 'lose', 'gain'],
							optionLabels: {
								maintain: t.goalOptions.maintain,
								lose: t.goalOptions.lose,
								gain: t.goalOptions.gain
							},
							value: userMetadata.goal[userMetadata.goal.length - 1]?.value ?? 0
						}}
					/>
					<MenuItem
						name='goalWeight'
						label={t.fields.goalWeight}
						attr={{
							name: 'goalWeight',
							label: t.fields.goalWeight,
							type: 'number',
							placeholder: t.placeholders.enterGoalWeight,
							value:
								userMetadata.goalWeight[userMetadata.goalWeight.length - 1]
									?.value ?? 0
						}}
					/>
					<MenuItem
						name='progress'
						label={t.fields.goalProgress}
						attr={{
							name: 'progress',
							label: t.fields.goalProgress,
							type: 'range',
							min: 0,
							max: 100,
							value: goalProgress
						}}
					/>
				</div>
			</div>
			<div className='mb-8'>
				<h2 className='mb-4 text-lg font-semibold'>{t.sections.supportInfo}</h2>
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					<Button
						variant='outline'
						className='h-auto w-full justify-start px-4 py-4'
						asChild
					>
						<Link href={`mailto:${SUPPORT_EMAIL}`}>
							<Mail className='mr-2 h-5 w-5' />
							<div className='flex flex-col items-start'>
								<span className='font-medium'>{t.support.reachOut}</span>
								<span className='text-sm text-muted-foreground'>
									{t.support.getTechnicalSupport}
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
									<span className='font-medium'>{t.support.about}</span>
									<span className='text-sm text-muted-foreground'>
										{t.support.learnMore}
									</span>
								</div>
							</Button>
						</DialogTrigger>
						<DialogContent className='max-w-[95%] rounded-lg sm:max-w-96 md:max-w-128'>
							<DialogHeader>
								<DialogTitle>{t.support.about}</DialogTitle>
							</DialogHeader>

							<div>
								<p>
									<span className='font-serif text-lg font-bold text-green-600 dark:text-green-500'>
										trac
										<span className='text-wood-950 dark:text-wood-100'>ky</span>
									</span>{' '}
									{dictionary.about.description}
								</p>
								<p className='mt-4'>{dictionary.about.purpose}</p>
								<p className='mt-4'>
									{dictionary.about.builtBy}{' '}
									<a
										href='https://x.com/fraineralex'
										className='text-blue-500'
										rel='noopener noreferrer'
										target='_blank'
									>
										fraineralex
									</a>
									. {dictionary.about.sourceCode}{' '}
									<a
										href='https://github.com/fraineralex/tracky'
										className='text-blue-500'
										rel='noopener noreferrer'
										target='_blank'
									>
										{dictionary.about.github}
									</a>
									.
								</p>
								<p className='mt-8 text-center text-sm text-muted-foreground'>
									{dictionary.common.version}
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
									<span className='font-medium'>
										{t.support.healthDisclaimer}
									</span>
									<span className='text-sm text-muted-foreground'>
										{t.support.understandGuidelines}
									</span>
								</div>
							</Button>
						</DialogTrigger>
						<DialogContent className='max-w-[95%] rounded-lg sm:max-w-96 md:max-w-128'>
							<DialogHeader>
								<DialogTitle>{t.healthDisclaimer.title}</DialogTitle>
							</DialogHeader>

							<div>
								<p>
									<span className='font-serif text-lg font-bold text-green-600 dark:text-green-500'>
										trac
										<span className='text-wood-950 dark:text-wood-100'>ky</span>
									</span>{' '}
									{t.healthDisclaimer.description}
								</p>
								<p className='mt-4'>{t.healthDisclaimer.advice}</p>
								<p className='mt-8 text-center text-sm text-muted-foreground'>
									{t.healthDisclaimer.safetyNote}{' '}
									<span className='font-serif font-bold text-green-600 dark:text-green-500'>
										trac
										<span className='text-wood-950 dark:text-wood-100'>ky</span>
									</span>
								</p>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<p className='mt-8 text-center text-sm text-muted-foreground'>
				{dictionary.common.version}
			</p>
		</>
	)
}
