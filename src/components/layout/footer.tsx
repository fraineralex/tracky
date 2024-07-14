import ExternalLink from '~/components/ui/external-link'
import { cn } from '~/lib/utils'
import React from 'react'
import { T3Logo, XLogo } from '~/components/ui/logos'
import { ArrowUpRight, Heart } from 'lucide-react'

const Footer = ({
	className,
	showTwitter
}: {
	className: string
	showTwitter?: boolean
}) => {
	return (
		<footer
			className={cn(
				'w-fit text-sm text-neutral-600 animate-in fade-in-25 dark:text-neutral-300',
				'bg-transparent backdrop-blur-md',
				className
			)}
		>
			<div className={cn('container flex items-center space-x-5')}>
				<div className='group flex items-center space-x-2 hover:text-neutral-800 group-hover:scale-105 hover:dark:text-neutral-200'>
					<Heart
						size={14}
						className='text-green-600 group-hover:fill-green-600'
					/>
					<ExternalLink
						href='https://create.t3.gg/'
						className='flex items-center space-x-1'
					>
						<p>Made by Frainer using</p>
						<T3Logo className='h-4 w-4' />
						<ArrowUpRight size={14} className='group-hover:scale-125' />
					</ExternalLink>
				</div>

				<div
					className={`${showTwitter ? 'flex' : 'hidden'} group items-center space-x-2`}
				>
					<XLogo className='h-3 w-3' />
					<ExternalLink
						href='https://twitter.com/pheralb_'
						className='flex items-center space-x-1'
					>
						<p className='hidden md:block'>Twitter</p>
						<ArrowUpRight size={14} />
					</ExternalLink>
				</div>
			</div>
		</footer>
	)
}

export default Footer
