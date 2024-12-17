'use client'

import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { Badge } from '../ui/badge'

interface Props {
	children: React.ReactNode
	label: string
	href: string
	enabled?: boolean
}

export default function SidenavButton({
	children,
	label,
	href,
	enabled
}: Props) {
	const pathname = usePathname()
	const router = useRouter()

	return (
		<>
			<Link
				title={enabled ? label : 'Coming soon'}
				aria-label={label}
				className={buttonVariants({
					variant: 'ghost',
					className: `inline-flex h-9 w-full gap-2 whitespace-nowrap sm:h-10 sm:flex-row sm:justify-start sm:text-sm ${pathname === href ? 'bg-accent text-accent-foreground dark:text-accent-foreground' : 'text-muted-foreground'} ${!enabled ? 'pointer-events-none' : ''}`
				})}
				href={href}
				prefetch={true}
				onMouseEnter={() => {
					router.prefetch(String(href))
				}}
				onMouseDown={e => {
					const url = new URL(String(href), window.location.href)
					if (
						url.origin === window.location.origin &&
						e.button === 0 &&
						!e.altKey &&
						!e.ctrlKey &&
						!e.metaKey &&
						!e.shiftKey
					) {
						e.preventDefault()
						router.push(String(href))
					}
				}}
			>
				{children}
				<span className='sr-only line-clamp-2 sm:not-sr-only'>{label}</span>
				{!enabled && (
					<Badge
						variant='secondary'
						className='hidden bg-inherit text-[10px] font-light md:inline'
					>
						Soon
					</Badge>
				)}
			</Link>
		</>
	)
}
