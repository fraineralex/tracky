'use client'

import { HouseIcon } from '../ui/icons'
import { Dumbbell, Ham, NotepadText, Settings } from 'lucide-react'
import SidenavButton from './sidenav-button'
import { usePathname } from 'next/navigation'

export default function SideNav() {
	const pathname = usePathname()

	if (pathname === '/' || pathname === '/onboarding') return null

	return (
		<nav className='flex shrink-0 flex-col items-center pt-5 md:w-[215px] md:items-start'>
			<article className='flex flex-row justify-between gap-x-4 gap-y-2 px-4 text-center md:flex-col md:px-6 md:text-left'>
				<SidenavButton label='Overview' href='/dashboard' enabled>
					<HouseIcon className='h-5 w-5 md:h-4 md:w-4' />
				</SidenavButton>
				<SidenavButton label='Food' href='/food' enabled>
					<Ham className='h-6 w-6 md:h-5 md:w-5' />
				</SidenavButton>
				<SidenavButton label='Exercise' href='/exercise' enabled>
					<Dumbbell className='h-6 w-6 md:h-5 md:w-5' />
				</SidenavButton>
				<SidenavButton label='Diary' href='/diary'>
					<NotepadText className='h-6 w-6 text-muted-foreground/50 sm:text-muted-foreground md:h-5 md:w-5' />
				</SidenavButton>
				<SidenavButton label='Settings' href='/settings' enabled>
					<Settings className='h-6 w-6 md:h-5 md:w-5' />
				</SidenavButton>
			</article>
		</nav>
	)
}
