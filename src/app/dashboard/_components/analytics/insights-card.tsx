import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { formatNumber } from '~/lib/utils'

export default function InsightsCard({
	title,
	dateRange,
	value,
	timeDistance,
	valueUnit,
	children,
	href,
	className = 'w-full rounded-lg dark:bg-slate-800/50 p-4 pb-1 border'
}: {
	title: string
	dateRange: string
	value?: number
	timeDistance?: string
	valueUnit: string
	children: React.ReactNode
	className?: string
	href?: string
}) {
	return (
		<Card className={className}>
			<header className='flex flex-col space-y-1'>
				<h3 className='font-semibold capitalize'>{title}</h3>
				<small className='text-gray-500 dark:text-gray-400'>{dateRange}</small>
			</header>
			{children}
			<footer className='flex items-center justify-between border-t pt-1'>
				<p className='font-normal'>
					{value && value != 0 && formatNumber(value)}
					{(!value || value === 0) && !timeDistance && '----'}
					{timeDistance &&
						timeDistance.charAt(0).toUpperCase() + timeDistance.slice(1)}{' '}
					<span className='text-sm font-normal text-gray-500 dark:text-gray-400'>
						{valueUnit}
					</span>
				</p>
				{href && (
					<Button
						variant='ghost'
						className='rounded-full px-1 duration-100 ease-in-out hover:scale-110 hover:bg-transparent'
						asChild
					>
						<Link href={href} prefetch={true}>
							<ChevronRight />
						</Link>
					</Button>
				)}
			</footer>
		</Card>
	)
}
