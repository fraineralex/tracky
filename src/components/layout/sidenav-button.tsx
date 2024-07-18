'use client'

import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { usePathname } from 'next/navigation'

interface Props {
	children: React.ReactNode
	label: string
	href: string
}

export default function SidenavButton({ children, label, href }: Props) {
	const pathname = usePathname()

	return (
		<Link
			className={buttonVariants({
				variant: 'ghost',
				className: `inline-flex h-9 gap-2 whitespace-nowrap sm:h-10 sm:flex-row sm:justify-start sm:text-sm ${pathname === href ? 'bg-accent text-accent-foreground dark:text-accent-foreground' : 'text-muted-foreground'}`
			})}
			href={href}
		>
			{children}
			<span className='sr-only line-clamp-2 sm:not-sr-only'>{label}</span>
		</Link>
	)
}
