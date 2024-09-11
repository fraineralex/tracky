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
import { useFormState } from 'react-dom'
import { ExerciseCategories } from '~/types'
import { useUser } from '@clerk/nextjs'

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
	const [state, formAction] = useFormState(addExercise, initialState)
	const { user } = useUser()
	console.log(user)

	if (state.success && state.message) {
		handleFormClose(state.message)
	}

	function CalcelButton() {
		return (
			<Button
				variant='outline'
				className='font-medium'
				type='button'
				onClick={() => handleCategorySelect(null)}
			>
				Cancel
			</Button>
		)
	}

	return (
		<form action={formAction}>
			{selectedCategory && (
				<div className='items-center bg-transparent px-10 py-5'>
					<header className='text-center'>
						<h2 className=' text-xl font-semibold'>{selectedCategory.label}</h2>
						{state.message && !state.success && (
							<p className='mt-2 text-sm text-red-500'>{state.message}</p>
						)}
					</header>
					<div className='grid grid-cols-2 gap-x-16 gap-y-5 pt-10'>
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
								/>
								<small className='my-auto ps-2 text-xs text-foreground/80'>
									Min
								</small>
							</div>
							{state.errors?.duration &&
								state.errors?.duration?.map(error => (
									<small
										key={error}
										className='col-span-5 text-nowrap text-xs font-light text-red-500'
									>
										{error}
									</small>
								))}
						</div>
						<div className='min-w-0 max-w-xs'>
							<div>
								<Label htmlFor='effort' className='sr-only'>
									Effort Level
								</Label>
								<Select name='effort' required>
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
							{state.errors?.effort?.map(error => (
								<small
									key={error}
									className='col-span-5 text-nowrap text-xs font-light text-red-500'
								>
									{error}
								</small>
							))}
						</div>
						<div className='min-w-0 max-w-xs '>
							<div className='grid grid-cols-5 space-x-14 pb-1'>
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
									min={0}
								/>
								<small className='my-auto ps-2 text-xs text-foreground/80'>
									Kcal
								</small>
							</div>
							{state.errors?.energyBurned?.map(error => (
								<small
									key={error}
									className='col-span-5 text-nowrap text-xs font-light text-red-500'
								>
									{error}
								</small>
							))}
							<p className='col-span-5 text-nowrap text-xs font-light text-foreground/80'>
								Based on your current weight of{' '}
								{user?.publicMetadata.weight as string}{' '}
								{user?.publicMetadata.weightUnit as string}
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
							{state.errors?.diaryGroup?.map(error => (
								<small
									key={error}
									className='col-span-5 text-nowrap text-xs font-light text-red-500'
								>
									{error}
								</small>
							))}
						</div>
					</div>
				</div>
			)}
			<DialogFooter className='flex space-x-5 pt-5'>
				{!selectedCategory && (
					<DialogClose>
						<CalcelButton />
					</DialogClose>
				)}
				{selectedCategory && <CalcelButton />}
				<Button
					variant='default'
					className='font-medium capitalize'
					disabled={!selectedCategory}
					type='submit'
				>
					Add to diary
				</Button>
			</DialogFooter>
		</form>
	)
}
