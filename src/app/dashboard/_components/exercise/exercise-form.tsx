'use strict'

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
import { ExerciseState, addExercise } from '../../_actions'
import { ExerciseCategories, TrakedField } from '~/types'
import { useUser } from '@clerk/nextjs'
import { EFFORT_LEVELS } from '~/constants'
import { ShowErrors } from '~/components/forms/show-errors'
import { calculateEnergyBurned } from '~/lib/calculations'
import { toast } from 'sonner'

const initialState: ExerciseState = {
	errors: {},
	message: '',
	success: false
}

export default function ExerciseForm({
	selectedCategory,
	handleFormClose,
	handleCategorySelect
}: {
	selectedCategory: ExerciseCategories[number] | null
	handleFormClose: (message: string) => void
	handleCategorySelect: (category: ExerciseCategories[number] | null) => void
}) {
	const [state, formAction, isPending] = React.useActionState(
		addExercise,
		initialState
	)
	const [duration, setDuration] = React.useState(60)
	const [energyBurned, setEnergyBurned] = React.useState<string | null>(null)
	const [effort, setEffort] = React.useState<keyof typeof EFFORT_LEVELS>('easy')
	const { user } = useUser()

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
				loading: 'Adding exercise...',
				id: 'exercise-form'
			})
		}
	}, [state, handleFormClose, isPending])

	if (!user) return null
	const { weights, height, born, sex } = user.publicMetadata

	const currentWeight = weights[weights.length - 1] as TrakedField[number]
	const age = new Date().getFullYear() - new Date(born as string).getFullYear()
	const currentHeight = height[height.length - 1] as TrakedField[number]

	function CalcelButton() {
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
				Cancel
			</Button>
		)
	}

	const energyBurnedValue = calculateEnergyBurned({
		duration,
		effort,
		currentWeight: currentWeight.value,
		height: currentHeight.value,
		age,
		sex,
		categoryMultiplier: Number(selectedCategory?.energyBurnedPerMinute)
	})

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
									Duration
								</Label>
								<Input
									required
									id='duration'
									name='duration'
									type='number'
									placeholder='Duration'
									className='col-span-3'
									min={0}
									value={duration}
									onChange={e => setDuration(Number(e.target.value))}
								/>
								<small className='my-auto ps-2 text-xs text-foreground/80'>
									Min
								</small>
							</div>
							<ShowErrors errors={state.errors?.duration} />
						</div>
						<div className='min-w-0 max-w-xs'>
							<div>
								<Label htmlFor='effort' className='sr-only'>
									Effort Level
								</Label>
								<Select
									name='effort'
									required
									onValueChange={(value: string) =>
										setEffort(value as keyof typeof EFFORT_LEVELS)
									}
								>
									<SelectTrigger id='effort'>
										<SelectValue placeholder='Effort Level' />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(EFFORT_LEVELS).map(([key, level]) => (
											<SelectItem key={key} value={key}>
												{level.label}
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
									Energy Burned
								</Label>
								<Input
									required
									id='duration'
									name='energyBurned'
									type='number'
									placeholder='Energy Burned'
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
								Based on your current weight of {currentWeight.value} kg
							</p>
						</div>
						<div className='w-full min-w-0 max-w-xs'>
							<div>
								<Label htmlFor='diaryGroup' className='sr-only'>
									Diairy Group
								</Label>
								<Select required name='diaryGroup'>
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
							Cancel
						</Button>
					</DialogClose>
				)}
				{selectedCategory && <CalcelButton />}
				<Button
					variant='default'
					className='mb-3 font-medium capitalize sm:mb-0'
					disabled={!selectedCategory}
					type='submit'
				>
					Add to diary
				</Button>
			</DialogFooter>
		</form>
	)
}
