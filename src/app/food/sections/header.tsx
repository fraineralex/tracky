import { Button } from '~/components/ui/button'
import { PlusCircle, ClipboardList, MessageSquare } from 'lucide-react'

export function Header() {
  return (
    
			<div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
				<h1 className='text-3xl font-bold hidden sm:block'>Food Tracker</h1>
				<div className='flex w-full flex-wrap items-center gap-2 sm:w-auto'>
					<Button size='sm' className='flex-grow sm:flex-grow-0'>
						<PlusCircle className='mr-2 h-4 w-4' /> Register Food
					</Button>
					<Button size='sm' className='flex-grow sm:flex-grow-0'>
						<ClipboardList className='mr-2 h-4 w-4' /> Add Meal
					</Button>
					<Button size='sm' className='flex-grow sm:flex-grow-0'>
						<MessageSquare className='mr-2 h-4 w-4' /> AI Chat
					</Button>
				</div>
			</div>
  )
}
