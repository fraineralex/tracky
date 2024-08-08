'use client'
import { useTheme } from 'next-themes'
import { Toaster as SonnerToaster, ToasterProps } from 'sonner'

export default function Toaster(props: ToasterProps) {
	const { theme } = useTheme()

	let sonnerTheme: 'light' | 'dark' | 'system' = 'system'
	if (theme === 'light') sonnerTheme = 'light'
	else if (theme === 'dark') sonnerTheme = 'dark'

	return <SonnerToaster {...props} theme={sonnerTheme} />
}
