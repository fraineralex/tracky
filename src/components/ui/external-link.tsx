import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'

interface Props {
	href: string
	children: ReactNode
	className?: string
	rel?: string
}

const ExternalLink = (props: Props) => {
	return (
		<a
			href={props.href}
			rel={props.rel ?? 'noopener noreferrer'}
			target='_blank'
			className={cn(props.className)}
		>
			{props.children}
		</a>
	)
}

export default ExternalLink
