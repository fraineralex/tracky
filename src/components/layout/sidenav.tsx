'use client'

import { HouseIcon } from '../ui/icons'
import { Dumbbell, Ham, NotepadText, Settings } from 'lucide-react'
import SidenavButton from './sidenav-button'
import { usePathname } from 'next/navigation'

export default function SideNav() {
	const pathname = usePathname()

	if (pathname === '/' || pathname === '/onboarding') return null

	return (
		<nav className='flex shrink-0 flex-col pt-10 sm:w-[215px]'>
			<article className='flex flex-row justify-between gap-x-4 gap-y-2 px-4 text-center sm:flex-col sm:px-6 sm:text-left'>
				<SidenavButton label='Overview' href='/dashboard'>
					<HouseIcon className='h-5 w-5 sm:h-4 sm:w-4' />
				</SidenavButton>
				<SidenavButton label='Food' href='/food'>
					<Ham className='h-6 w-6 sm:h-5 sm:w-5' />
				</SidenavButton>
				<SidenavButton label='Exercise' href='/exercise'>
					<Dumbbell className='h-6 w-6 sm:h-5 sm:w-5' />
				</SidenavButton>
				<SidenavButton label='Diary' href='/diary'>
					<NotepadText className='h-6 w-6 sm:h-5 sm:w-5' />
				</SidenavButton>
				<SidenavButton label='Settings' href='/settings'>
					<Settings className='h-6 w-6 sm:h-5 sm:w-5' />
				</SidenavButton>
			</article>
		</nav>
	)
}
