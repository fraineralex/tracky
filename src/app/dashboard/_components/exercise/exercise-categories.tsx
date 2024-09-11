'use client'

import { Input } from '~/components/ui/input'
import { ExerciseCard } from './exercise-card'
import React from 'react'
import { Label } from '~/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'
import { EXERCISE_CATEGORIES, ExerciseCategory } from '~/constants'
import { DialogFooter } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '~/components/ui/breadcrumb'
import { SlashIcon } from '@radix-ui/react-icons'
import { ExerciseState, addExercise } from '../../_actions'
import { useFormState } from 'react-dom'

const initialState: ExerciseState = {
	errors: {},
	message: '',
	success: false
}

export default function ExerciseCategories() {
	const [state, formAction] = useFormState(addExercise, initialState)
	const [selectedCategory, setSelectedCategory] =
		React.useState<ExerciseCategory | null>(null)
	const [duration, setDuration] = React.useState('')
	const [effort, setEffort] = React.useState('')
	const [energyBurned, setEnergyBurned] = React.useState('')
	const [diaryGroup, setDiaryGroup] = React.useState('')

	const handleCategorySelect = (category: ExerciseCategory) => () => {
		setSelectedCategory(category)
	}

	return (
		<section className='px-5'>
			{selectedCategory && (
				<Breadcrumb className='py-2'>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink
								onClick={() => setSelectedCategory(null)}
								className='cursor-pointer'
							>
								Categories
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator>
							<SlashIcon />
						</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbPage>{selectedCategory.title}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			)}

			{!selectedCategory && (
				<div className='grid grid-cols-4 gap-4 py-10'>
					{EXERCISE_CATEGORIES.map(category => (
						<ExerciseCard
							key={category.title}
							title={category.title}
							Icon={category.icon}
							handleCategorySelect={handleCategorySelect(category)}
						/>
					))}
				</div>
			)}
			<form action={formAction}>
				{selectedCategory && (
					<div className='items-center bg-transparent px-10 py-5'>
						<header className='text-center'>
							<h2 className=' text-xl font-semibold'>
								{selectedCategory.label}
							</h2>
							{state && state.message && !state.success && (
								<p className='text-sm text-red-500'>{state.message}</p>
							)}
						</header>
						<div className='grid grid-cols-2 gap-x-16 gap-y-5 pt-10'>
							<div className='grid min-w-0 max-w-xs grid-cols-5 space-x-14'>
								<Label htmlFor='duration' className='my-auto'>
									Duration
								</Label>
								<Input
									required
									id='duration'
									name='duration'
									type='number'
									placeholder='Duration'
									className='col-span-3'
									value={duration}
									onChange={e => setDuration(e.target.value)}
									min={0}
								/>
								<small className='my-auto ps-2 text-xs text-foreground/80'>
									Min
								</small>
							</div>
							<div className='min-w-0 max-w-xs'>
								<Label htmlFor='effort' className='sr-only'>
									Effort Level
								</Label>
								<Select
									name='effort'
									value={effort}
									onValueChange={setEffort}
									required
								>
									<SelectTrigger id='effort'>
										<SelectValue placeholder='Effort Level' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='easy'>Easy</SelectItem>
										<SelectItem value='moderate'>Moderate</SelectItem>
										<SelectItem value='hard'>Hard</SelectItem>
										<SelectItem value='very-hard'>Very Hard</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='min-w-0 max-w-xs '>
								<div className='grid grid-cols-5 space-x-14'>
									<Label htmlFor='duration' className='my-auto text-nowrap'>
										Energy Burned
									</Label>
									<Input
										required
										id='duration'
										name='energyBurned'
										type='number'
										placeholder='Energy Burned'
										className='col-span-3'
										value={energyBurned}
										onChange={e => setEnergyBurned(e.target.value)}
										min={0}
									/>
									<small className='my-auto ps-2 text-xs text-foreground/80'>
										Kcal
									</small>
								</div>
								<p className='col-span-5 text-nowrap pt-3 text-xs font-light text-foreground/80'>
									Based on your current weight of 200 lbs
								</p>
							</div>
							<div className='w-full min-w-0 max-w-xs'>
								<Label htmlFor='diaryGroup' className='sr-only'>
									Diairy Group
								</Label>
								<Select
									required
									name='diaryGroup'
									value={diaryGroup}
									onValueChange={setDiaryGroup}
								>
									<SelectTrigger id='diaryGroup'>
										<SelectValue placeholder='Diairy Group' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='breakfast'>Breakfast</SelectItem>
										<SelectItem value='lunch'>Lunch</SelectItem>
										<SelectItem value='dinner'>Dinner</SelectItem>
										<SelectItem value='snack'>Snack</SelectItem>
										<SelectItem value='uncategorized'>Uncategorized</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				)}
				<DialogFooter className='flex space-x-5 pt-5'>
					<Button variant='outline' className='font-medium'>
						Cancel
					</Button>
					<Button
						variant='default'
						className='font-medium capitalize'
						disabled={!duration || !effort || !energyBurned || !diaryGroup}
						type='submit'
					>
						Add to diary
					</Button>
				</DialogFooter>
			</form>
		</section>
	)
}
