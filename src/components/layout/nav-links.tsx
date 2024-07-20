'use client'

import Link from 'next/link'
import { Button } from '../ui/button'
import { SignedIn } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
export default function NavLinks() {
	const pathname = usePathname()
	if (pathname !== '/') return null

	return (
		<article className='hidden sm:flex space-x-4 pt-3 text-sm text-foreground'>
			<Button variant='link' asChild title='Home page' aria-label='Home page'>
				<Link
					href='/'
					className='underline decoration-2 underline-offset-[6px]'
				>
					Home
				</Link>
			</Button>
			<SignedIn>
				<Button
					variant='link'
					asChild
					title='Dashboard page'
					aria-label='Dashboard page'
				>
					<Link href='/dashboard' className=''>
						Dashboard
					</Link>
				</Button>
			</SignedIn>
			<Button
				variant='link'
				asChild
				title='Contact developer'
				aria-label='Contact developer'
			>
				<Link href='mailto:frainerdeveloper@gmail.com' className=''>
					Contact
				</Link>
			</Button>
		</article>
	)
}
