import { CircleHelp } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'

export function About() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='fixed bottom-1 right-2 z-50 sm:bottom-2 sm:right-4'
				>
					<CircleHelp className='size-4 text-muted-foreground' />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>About</DialogTitle>
				</DialogHeader>
				<div className='flex flex-col justify-center gap-4 text-sm text-muted-foreground'>
					<p>
						<span className='font-serif font-bold text-green-600 dark:text-green-500'>
							trac
							<span className='text-wood-950 dark:text-wood-100'>ky</span>
						</span>{' '}
						is a free fitness tracking web app with AI-powered features to
						quickly log meals and exercises, helping you stay healthy and fit.
					</p>
					<p>
						Whether you&apos;re aiming to lose weight, build muscle, or maintain
						a healthy lifestyle. Tracky makes tracking your progress simple and
						efficient.
					</p>
					<p className='text-pretty'>
						Built by{' '}
						<a
							href='https://www.fraineralex.dev'
							target='_blank'
							rel='noopener noreferrer'
							className='text-blue-500'
						>
							fraineralex
						</a>
						. {''}
						Source code available on{' '}
						<a
							href='https://github.com/fraineralex/tracky'
							target='_blank'
							rel='noopener noreferrer'
							className='text-blue-500'
						>
							GitHub
						</a>
						.
					</p>
					<p>
						If you have any issues, reach out via{' '}
						<a
							href='mailto:fraineralex2001@gmail.com'
							className='text-blue-500'
						>
							Email
						</a>{' '}
						or{' '}
						<a
							href='https://x.com/fraineralex'
							target='_blank'
							rel='noopener noreferrer'
							className='text-blue-500'
						>
							Twitter
						</a>
						.
					</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}
