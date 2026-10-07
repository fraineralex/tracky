'use client'

import { Input } from '~/components/ui/input'
import React from 'react'
import { Label } from '~/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'
import { DialogClose, DialogFooter } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { type ExerciseState, addExercise } from '../../_actions'
import { type ExerciseCategories } from '~/types'
import { type ExerciseBody } from '~/types/profile'
import { EFFORT_LEVELS } from '~/constants'
import { ShowErrors } from '~/components/forms/show-errors'
import { calculateEnergyBurned } from '~/lib/calculations'
import { toast } from 'sonner'
import { useDictionary } from '~/components/providers/dictionary-provider'

const initialState: ExerciseState = {
	errors: {},
	message: '',
	success: false
}

export default function ExerciseForm({
	selectedCategory,
	handleFormClose,
	handleCategorySelect,
	body
}: {
	selectedCategory: ExerciseCategories[number] | null
	handleFormClose: (message: string) => void
	handleCategorySelect: (category: ExerciseCategories[number] | null) => void
	body: ExerciseBody | null
}) {
	const { dictionary } = useDictionary()
	const [state, formAction, isPending] = React.useActionState(
		addExercise,
		initialState
	)
	const [duration, setDuration] = React.useState(60)
	const [energyBurned, setEnergyBurned] = React.useState<string | null>(null)
	const [effort, setEffort] = React.useState<keyof typeof EFFORT_LEVELS>('easy')

	React.useEffect(() => {
		if (state.success && state.message) {
			handleFormClose(state.message)
			toast.dismiss('exercise-form')
		}

		if (!state.success && isPending) {
			const promise = () =>
				new Promise(resolve =>
					setTimeout(() => resolve({ name: 'Sonner' }), 100000)
				)

			toast.promise(promise, {
				loading: dictionary.aiChat.loadingMessages.addingExercise,
				id: 'exercise-form'
			})
		}
	}, [state, handleFormClose, isPending, dictionary])

	if (!body) return null
	const age = new Date().getFullYear() - new Date(body.born).getFullYear()

	function CancelButton() {
		return (
			<Button
				variant='outline'
				className='w-full font-medium sm:w-auto'
				type='button'
				onClick={() => {
					setDuration(60)
					setEnergyBurned(null)
					setEffort('easy')
					handleCategorySelect(null)
				}}
			>
				{dictionary.common.cancel}
			</Button>
		)
	}

	const energyBurnedValue = calculateEnergyBurned({
		duration,
		effort,
		currentWeight: body.weight,
		height: body.height,
		age,
		sex: body.sex,
		categoryMultiplier: Number(selectedCategory?.energyBurnedPerMinute)
	})

	// Get localized effort labels
	const getEffortLabel = (key: string) => {
		const effortLabels: Record<string, string> = {
			easy: dictionary.exercise.effortLevels.easy,
			moderate: dictionary.exercise.effortLevels.moderate,
			hard: dictionary.exercise.effortLevels.hard,
			'very-hard': dictionary.exercise.effortLevels['very-hard']
		}
		return effortLabels[key] ?? key
	}

	return (
		<form action={formAction}>
			{selectedCategory && (
				<div className='items-center bg-transparent py-5 md:px-10'>
					<header className='text-center'>
						<h2 className=' text-xl font-semibold'>{selectedCategory.label}</h2>
						{state.message && !state.success && (
							<p className='mt-2 text-sm text-red-500'>{state.message}</p>
						)}
					</header>
					<div className='grid grid-cols-2 gap-x-16 gap-y-5 pt-5 md:pt-10'>
						<input
							type='hidden'
							name='categoryId'
							value={selectedCategory.id}
						/>
						<div className='min-w-0 max-w-xs '>
							<div className='grid grid-cols-5 space-x-14 pb-1'>
								<Label htmlFor='duration' className='my-auto'>
									{dictionary.exercise.form.duration}
								</Label>
								<Input
									required
									id='duration'
									name='duration'
									type='number'
									placeholder={dictionary.exercise.form.durationPlaceholder}
									className='col-span-3'
									min={0}
									value={duration}
									onChange={e => setDuration(Number(e.target.value))}
								/>
								<small className='my-auto ps-2 text-xs text-foreground/80'>
									{dictionary.common.units.min_abbr}
								</small>
							</div>
							<ShowErrors errors={state.errors?.duration} />
						</div>
						<div className='min-w-0 max-w-xs'>
							<div>
								<Label htmlFor='effort' className='sr-only'>
									{dictionary.exercise.form.effortLevel}
								</Label>
								<Select
									name='effort'
									required
									onValueChange={(value: string) =>
										setEffort(value as keyof typeof EFFORT_LEVELS)
									}
								>
									<SelectTrigger id='effort'>
										<SelectValue
											placeholder={dictionary.exercise.form.effortLevel}
										/>
									</SelectTrigger>
									<SelectContent>
										{Object.entries(EFFORT_LEVELS).map(([key]) => (
											<SelectItem key={key} value={key}>
												{getEffortLabel(key)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<ShowErrors errors={state.errors?.effort} />
						</div>
						<div className='min-w-0 max-w-xs '>
							<div className='grid grid-cols-5 space-x-14 pb-1'>
								<Label htmlFor='duration' className='my-auto md:text-nowrap'>
									{dictionary.exercise.form.energyBurned}
								</Label>
								<Input
									required
									id='duration'
									name='energyBurned'
									type='number'
									placeholder={dictionary.exercise.form.energyBurnedPlaceholder}
									className='col-span-3'
									min={0}
									value={energyBurned ?? energyBurnedValue}
									onChange={e => setEnergyBurned(e.target.value)}
								/>
								<small className='my-auto ps-2 text-xs text-foreground/80'>
									Kcal
								</small>
							</div>
							<ShowErrors errors={state.errors?.energyBurned} />

							<p className='col-span-5 text-nowrap text-xs font-light text-foreground/80'>
								{dictionary.exercise.form.basedOnWeight.replace(
									'{weight}',
									String(body.weight)
								)}
							</p>
						</div>
						<div className='w-full min-w-0 max-w-xs'>
							<div>
								<Label htmlFor='diaryGroup' className='sr-only'>
									{dictionary.exercise.form.diaryGroup}
								</Label>
								<Select required name='diaryGroup'>
									<SelectTrigger id='diaryGroup'>
										<SelectValue
											placeholder={dictionary.exercise.form.diaryGroup}
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='breakfast'>
											{dictionary.common.meals.breakfast}
										</SelectItem>
										<SelectItem value='lunch'>
											{dictionary.common.meals.lunch}
										</SelectItem>
										<SelectItem value='dinner'>
											{dictionary.common.meals.dinner}
										</SelectItem>
										<SelectItem value='snack'>
											{dictionary.common.meals.snack}
										</SelectItem>
										<SelectItem value='uncategorized'>
											{dictionary.common.meals.uncategorized}
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<ShowErrors errors={state.errors?.diaryGroup} />
						</div>
					</div>
				</div>
			)}
			<DialogFooter className='pt-5 sm:flex sm:space-x-5'>
				{!selectedCategory && (
					<DialogClose asChild>
						<Button
							variant='outline'
							className='w-full font-medium sm:w-auto'
							type='button'
						>
							{dictionary.common.cancel}
						</Button>
					</DialogClose>
				)}
				{selectedCategory && <CancelButton />}
				<Button
					variant='default'
					className='mb-3 font-medium capitalize sm:mb-0'
					disabled={!selectedCategory}
					type='submit'
				>
					{dictionary.exercise.form.addToDiary}
				</Button>
			</DialogFooter>
		</form>
	)
}
