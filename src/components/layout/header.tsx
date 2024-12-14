import {
	ClerkLoaded,
	ClerkLoading,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton
} from '@clerk/nextjs'
import { ModeToggle } from '~/components/theme/mode-toggle'
import { Button, buttonVariants } from '../ui/button'
import { Github } from '../ui/icons'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import ExternalLink from '../ui/external-link'
import NavLinks from './nav-links'
import { Skeleton } from '../ui/skeleton'

export function Header() {
	return (
		<nav className='flex w-full items-center justify-between px-5 pb-2 pt-8 text-xl font-semibold md:px-10 lg:px-16'>
			<div className='flex space-x-10 md:space-x-28'>
				<Link
					href='/'
					className='flex items-center space-x-3 transition-opacity hover:opacity-80 rtl:space-x-reverse'
				>
					<h1 className='font-serif text-3xl font-bold text-green-600 dark:text-green-500'>
						trac<span className='text-wood-950 dark:text-wood-100'>ky</span>
					</h1>
					<Badge
						className='hidden cursor-pointer rounded-full md:block'
						variant='outline'
					>
						alpha
					</Badge>
				</Link>
				<NavLinks />
			</div>
			<div className='flex flex-row items-center gap-3'>
				<ExternalLink
					href='https://github.com/fraineralex/tracky'
					className={buttonVariants({ variant: 'ghost', size: 'icon' })}
				>
					<Github className='h-6 w-6' />
				</ExternalLink>

				<ModeToggle />
				<SignedOut>
					<ClerkLoaded>
						<Button
							className='rounded-full bg-forest-300 font-medium text-wood-950 hover:bg-forest-400 dark:bg-forest-600 dark:text-wood-100 dark:hover:bg-forest-500'
							asChild
						>
							<SignInButton>Sign In</SignInButton>
						</Button>
					</ClerkLoaded>
					<ClerkLoading>
						<Button className='rounded-full bg-forest-300 font-medium text-wood-950 hover:bg-forest-400 dark:bg-forest-600 dark:text-wood-100 dark:hover:bg-forest-500'>
							Sign In
						</Button>
					</ClerkLoading>
				</SignedOut>
				<SignedIn>
					<ClerkLoading>
						<Skeleton className='h-7 w-7 rounded-full' />
					</ClerkLoading>
					<ClerkLoaded>
						<UserButton />
					</ClerkLoaded>
				</SignedIn>
			</div>
		</nav>
	)
}
