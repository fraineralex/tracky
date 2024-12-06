'use client'

import { Button } from '~/components/ui/button'
import { DialogClose } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'
import { FoodState, registerFood } from '../_actions'
import { ShowErrors } from '~/components/forms/show-errors'
import { toast } from 'sonner'
import React from 'react'

const initialState: FoodState = {
	errors: {},
	message: '',
	success: false
}

export function RegisterFoodForm() {
	const [state, formAction] = React.useActionState(registerFood, initialState)
	const cancelBtnRef = React.useRef<HTMLButtonElement>(null)

	React.useEffect(() => {
		if (state.success) {
			toast.success(state.message)
			cancelBtnRef.current?.click()
		}
	}, [state])

	return (
		<>
			<header className='text-center'>
				{state.message && !state.success && (
					<p className='text-sm font-semibold text-red-500'>{state.message}</p>
				)}
			</header>
			<form className='space-y-4' action={formAction}>
				<div className='space-y-2'>
					<Label htmlFor='name'>Name</Label>
					<Input name='name' placeholder='e.g. Banana' required />
					<ShowErrors errors={state.errors?.name} />
				</div>
				<div className='grid grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label htmlFor='calories'>Calories</Label>
						<Input name='kcal' type='number' placeholder='e.g. 105' required />
						<ShowErrors errors={state.errors?.kcal} />
					</div>
					<div className='space-y-2'>
						<Label htmlFor='protein'>Protein (g)</Label>
						<Input
							name='protein'
							type='number'
							step='0.1'
							placeholder='e.g. 1.3'
							required
						/>
						<ShowErrors errors={state.errors?.protein} />
					</div>
				</div>
				<div className='grid grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label htmlFor='carbs'>Carbs (g)</Label>
						<Input
							name='carbs'
							type='number'
							step='0.1'
							placeholder='e.g. 27'
							required
						/>
						<ShowErrors errors={state.errors?.carbs} />
					</div>
					<div className='space-y-2'>
						<Label htmlFor='fats'>Fats (g)</Label>
						<Input
							name='fat'
							type='number'
							step='0.1'
							placeholder='e.g. 0.3'
							required
						/>
					</div>
				</div>
				<div className='grid grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label htmlFor='serving-size'>Serving Size</Label>
						<Input
							name='servingSize'
							type='number'
							step='0.1'
							placeholder='e.g. 100'
							defaultValue={100}
							required
						/>
						<ShowErrors errors={state.errors?.servingSize} />
					</div>
					<div className='space-y-2'>
						<Label htmlFor='serving-unit'>Serving Unit</Label>
						<Select required name='unit' defaultValue='g'>
							<SelectTrigger name='serving-unit'>
								<SelectValue placeholder='Select unit' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='g'>g</SelectItem>
								<SelectItem value='ml'>ml</SelectItem>
								<SelectItem value='oz'>oz</SelectItem>
								<SelectItem value='cup'>cup</SelectItem>
							</SelectContent>
						</Select>
						<ShowErrors errors={state.errors?.unit} />
					</div>
				</div>
				<div className='flex justify-end space-x-2 pt-4'>
					<DialogClose asChild>
						<Button type='button' variant='outline' ref={cancelBtnRef}>
							Cancel
						</Button>
					</DialogClose>
					<Button type='submit'>Register</Button>
				</div>
			</form>
		</>
	)
}
