import { HouseIcon } from '../ui/logos'
import { Dumbbell, Ham, NotepadText, Settings } from 'lucide-react'
import SidenavButton from './sidenav-button'

export default function SideNav() {
	return (
		<nav className='flex w-screen shrink-0 flex-col sm:w-[215px]'>
			<article className='flex flex-row justify-between gap-x-4 gap-y-2 px-4 text-center sm:flex-col sm:px-6 sm:text-left'>
				<SidenavButton label='Overview' href='/dashboard'>
					<HouseIcon className='h-6 w-6 sm:h-5 sm:w-5' />
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
