import { ChevronRight } from 'lucide-react'
import { Button } from '~/components/ui/button'

export default function InsightsCard({
	title,
	dateRange,
	value,
	valueUnit,
	children
}: {
	title: string
	dateRange: string
	value: number
	valueUnit: string
	children: React.ReactNode
}) {
	return (
		<article className='w-56 rounded-md bg-slate-800/50 p-4 pb-1'>
			<header className='flex flex-col space-y-1'>
				<h3>{title}</h3>
				<small className='text-gray-400'>{dateRange}</small>
			</header>
			{children}
			<footer className='flex items-center justify-between border-t pt-1'>
				<p className='font-normal'>
					{value}{' '}
					<span className='text-sm font-normal text-gray-400'>{valueUnit}</span>
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
