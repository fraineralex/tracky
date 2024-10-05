import { Button } from '~/components/ui/button'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'
import { PlusCircle } from 'lucide-react'
import { RegisterFoodForm } from './resgister-food-form'

export default function RegisterFoodDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size='sm' className='flex-grow sm:flex-grow-0'>
					<PlusCircle className='mr-2 h-4 w-4' /> Register Food
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Register New Food</DialogTitle>
					<DialogDescription>
						Enter the details of the food item you want to register.
					</DialogDescription>
				</DialogHeader>
				<RegisterFoodForm />
			</DialogContent>
		</Dialog>
	)
}
