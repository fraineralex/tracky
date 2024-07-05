import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { ModeToggle } from '~/components/theme/mode-toggle'
import { buttonVariants } from '../ui/button'
import { Github } from '../ui/icons'
import Link from 'next/link'

export function Header() {
	return (
		<nav className='flex w-full items-center justify-between px-16 py-10 text-xl font-semibold'>
			<h1 className='font-serif text-4xl font-bold text-green-600 dark:text-green-500'>
				trac<span className='text-wood-950 dark:text-wood-100'>ky</span>
			</h1>

			<div className='flex flex-row items-center gap-3'>
				<Link
					href='https://github.com/fraineralex/tracky'
					className={buttonVariants({ variant: 'ghost', size: 'icon' })}
					rel='noopener noreferrer'
					target='_blank'
				>
					<Github className='absolute h-6 w-6' />
				</Link>

				<ModeToggle />
				<SignedOut>
					<SignInButton>
						<span className='bg-forest-300 dark:bg-forest-600 text-wood-950 dark:text-wood-100 rounded-full border p-2 px-4 text-base font-medium'>
							Get Started
						</span>
					</SignInButton>
				</SignedOut>
				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</nav>
	)
}
