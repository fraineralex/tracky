import { Dumbbell, HandPlatter } from 'lucide-react'

export default function ResumeStreak() {
	return (
		<article className='w-full max-w-xs 2xl:max-w-sm rounded-lg border bg-slate-800/50 py-1'>
			<div className='grid grid-cols-2 gap-6 p-6'>
				<header className='flex flex-col items-center gap-2'>
					<HandPlatter className='h-8 w-8 text-primary' />
					<div className='text-2xl font-bold'>14</div>
					<p className='text-sm text-muted-foreground'>Food Streak</p>
				</header>
				<footer className='flex flex-col items-center gap-2'>
					<Dumbbell className='h-8 w-8 text-primary' />
					<div className='text-2xl font-bold'>8</div>
					<p className='text-sm text-muted-foreground'>Exercise Streak</p>
				</footer>
			</div>
		</article>
	)
}
