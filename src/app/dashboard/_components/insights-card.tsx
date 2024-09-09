import { ChevronRight } from 'lucide-react'
import { Button } from '~/components/ui/button'

export default function InsightsCard({
	title,
	dateRange,
	value,
	valueUnit,
	children,
	className = 'w-56 rounded-lg dark:bg-slate-800/50 bg-slate-200/50 p-4 pb-1 border'
}: {
	title: string
	dateRange: string
	value: number
	valueUnit: string
	children: React.ReactNode
	className?: string
}) {
	return (
		<article className={className}>
			<header className='flex flex-col space-y-1'>
				<h3>{title}</h3>
				<small className='dark:text-gray-400 text-gray-500'>{dateRange}</small>
			</header>
			{children}
			<footer className='flex items-center justify-between border-t pt-1'>
				<p className='font-normal'>
					{value != 0 ? value : '----'}{' '}
					<span className='text-sm font-normal dark:text-gray-400 text-gray-500'>{valueUnit}</span>
				</p>
				<Button
					variant='ghost'
					className='rounded-full px-1 duration-100 ease-in-out hover:scale-110 hover:bg-transparent'
				>
					<ChevronRight />
				</Button>
			</footer>
		</article>
	)
}
