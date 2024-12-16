import {
	Dumbbell,
	Ham,
	HouseIcon,
	Moon,
	NotepadText,
	Settings,
	Sun
} from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Github } from '~/components/ui/icons'
import { Skeleton } from '~/components/ui/skeleton'

export function HeaderSkeleton() {
	return (
		<nav className='flex w-full items-center justify-between px-5 pb-2 pt-8 text-xl font-semibold md:px-10 lg:px-16'>
			<div className='flex space-x-10 md:space-x-28'>
				<span className='flex items-center space-x-3 transition-opacity rtl:space-x-reverse'>
					<h1 className='font-serif text-3xl font-bold text-green-600 dark:text-green-500'>
						trac<span className='text-wood-950 dark:text-wood-100'>ky</span>
					</h1>
					<Badge className='hidden rounded-full md:block' variant='outline'>
						alpha
					</Badge>
				</span>
			</div>
			<div className='flex flex-row items-center gap-3'>
				<Github className='h-6 w-6' />
				<Sun className='h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
				<Moon className='absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
				<Skeleton className='h-7 w-7 rounded-full' />
			</div>
		</nav>
	)
}

export function SideNavSkeleton() {
	return (
		<div className='flex shrink-0 flex-col items-center pt-5 md:w-[215px] md:items-start'>
			<article className='flex flex-row justify-between gap-x-4 gap-y-2 px-4 text-center md:flex-col md:px-6 md:text-left'>
				<span className='inline-flex h-9 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors sm:h-10 sm:flex-row sm:justify-start sm:text-sm'>
					<HouseIcon className='h-5 w-5 md:h-4 md:w-4' />
					<span className='sr-only line-clamp-2 sm:not-sr-only'>Overview</span>
				</span>
				<span className='inline-flex h-9 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors sm:h-10 sm:flex-row sm:justify-start sm:text-sm'>
					<Ham className='h-6 w-6 md:h-5 md:w-5' />
					<span className='sr-only line-clamp-2 sm:not-sr-only'>Food</span>
				</span>
				<span className='inline-flex h-9 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors sm:h-10 sm:flex-row sm:justify-start sm:text-sm'>
					<Dumbbell className='h-6 w-6 md:h-5 md:w-5' />
					<span className='sr-only line-clamp-2 sm:not-sr-only'>Exercise</span>
				</span>
				<span className='inline-flex h-9 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors sm:h-10 sm:flex-row sm:justify-start sm:text-sm'>
					<NotepadText className='h-6 w-6 md:h-5 md:w-5' />
					<span className='sr-only line-clamp-2 sm:not-sr-only'>Diary</span>
				</span>
				<span className='inline-flex h-9 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors sm:h-10 sm:flex-row sm:justify-start sm:text-sm'>
					<Settings className='h-6 w-6 md:h-5 md:w-5' />
					<span className='sr-only line-clamp-2 sm:not-sr-only'>Settings</span>
				</span>
			</article>
		</div>
	)
}

export function LoadingSkeleton() {
	return (
		<>
			<HeaderSkeleton />
			<main className='px-4 md:flex md:px-10'>
				<SideNavSkeleton />
				<Skeleton className='mx-auto mt-5 h-screen w-full' />
			</main>
		</>
	)
}
