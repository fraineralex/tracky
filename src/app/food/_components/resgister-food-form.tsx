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
export function RegisterFoodForm() {
	return (
		<form className='space-y-4'>
			<div className='space-y-2'>
				<Label htmlFor='name'>Name</Label>
				<Input id='name' placeholder='e.g. Banana' required />
			</div>
			<div className='grid grid-cols-2 gap-4'>
				<div className='space-y-2'>
					<Label htmlFor='calories'>Calories</Label>
					<Input
						name='calories'
						type='number'
						placeholder='e.g. 105'
						required
					/>
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
				</div>
				<div className='space-y-2'>
					<Label htmlFor='fats'>Fats (g)</Label>
					<Input
						name='fats'
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
						name='serving-size'
						type='number'
						step='0.1'
						placeholder='e.g. 118'
						required
					/>
				</div>
				<div className='space-y-2'>
					<Label htmlFor='serving-unit'>Serving Unit</Label>
					<Select required>
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
				</div>
			</div>
			<div className='flex justify-end space-x-2 pt-4'>
				<DialogClose>
					<Button type='button' variant='outline'>
						Cancel
					</Button>
				</DialogClose>
				<Button type='submit'>Register</Button>
			</div>
		</form>
	)
}
