import {
	ClerkLoaded,
	ClerkLoading,
	SignedIn,
	SignedOut,
	SignInButton
} from '@clerk/nextjs'
import { Button } from '../ui/button'
import { HouseIcon, Play } from 'lucide-react'
import Link from 'next/link'

export function GetStartedButton() {
	return (
		<>
			<ClerkLoading>
				<Button
					variant='default'
					size='lg'
					className='group h-12 cursor-pointer px-6 hover:opacity-90 dark:hover:opacity-70'
				>
					<span className='flex space-x-2'>
						<Play className='h-5 w-5 duration-100 ease-in-out group-hover:scale-110' />
						<i className='text-base font-medium not-italic'>Get started</i>
					</span>
				</Button>
			</ClerkLoading>
			<ClerkLoaded>
				<SignedOut>
					<Button
						variant='default'
						size='lg'
						className='group h-12 cursor-pointer px-6 hover:opacity-90 dark:hover:opacity-70'
						asChild
					>
						<span className='flex space-x-2'>
							<Play className='h-5 w-5 duration-100 ease-in-out group-hover:scale-110' />
							<SignInButton>
								<i className='text-base font-medium not-italic'>Get started</i>
							</SignInButton>
						</span>
					</Button>
				</SignedOut>
			</ClerkLoaded>
			<ClerkLoaded>
				<SignedIn>
					<Button
						variant='default'
						size='lg'
						className='group h-12 cursor-pointer px-6 hover:opacity-90 dark:hover:opacity-70'
						asChild
					>
						<Link className='flex space-x-2' href='/dashboard'>
							<HouseIcon className='h-4 w-4 duration-100 ease-in-out group-hover:scale-110' />
							<i className='text-base font-medium not-italic'>Dashboard</i>
						</Link>
					</Button>
				</SignedIn>
			</ClerkLoaded>
		</>
	)
}
