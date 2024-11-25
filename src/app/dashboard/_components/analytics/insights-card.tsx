import { ChevronRight } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'

export default function InsightsCard({
	title,
	dateRange,
	value,
	valueUnit,
	children,
	className = 'w-full rounded-lg dark:bg-slate-800/50 p-4 pb-1 border -ml-3 lg:ml-0'
}: {
	title: string
	dateRange: string
	value: number
	valueUnit: string
	children: React.ReactNode
	className?: string
}) {
	return (
		<Card className={className}>
			<header className='flex flex-col space-y-1'>
				<h3 className='font-semibold'>{title}</h3>
				<small className='text-gray-500 dark:text-gray-400'>{dateRange}</small>
			</header>
			{children}
			<footer className='flex items-center justify-between border-t pt-1'>
				<p className='font-normal'>
					{value != 0 ? value.toLocaleString() : '----'}{' '}
					<span className='text-sm font-normal text-gray-500 dark:text-gray-400'>
						{valueUnit}
					</span>
				</p>
				<Button
					variant='ghost'
					className='rounded-full px-1 duration-100 ease-in-out hover:scale-110 hover:bg-transparent'
				>
					<ChevronRight />
				</Button>
			</footer>
		</Card>
	)
}
