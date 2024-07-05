import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { ModeToggle } from '~/components/theme/mode-toggle'

export function Header() {
	return (
		<nav className='flex w-full items-center justify-between border-b p-4 text-xl font-semibold'>
			<div>Tracky</div>

			<div className='flex flex-row items-center gap-4'>
				<ModeToggle />
				<SignedOut>
					<SignInButton />
				</SignedOut>
				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</nav>
	)
}
