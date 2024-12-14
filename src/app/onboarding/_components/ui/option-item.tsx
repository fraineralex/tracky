import { LucideProps } from 'lucide-react'

export default function OptionItem({
	active,
	Icon,
	title,
	description,
	selectItem
}: {
	active: boolean
	Icon: React.ForwardRefExoticComponent<
		Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
	>
	title: string
	description: string
	selectItem: () => void
}) {
	return (
		<button
			className={`flex lg:min-w-[320px] items-center justify-start space-x-5 overflow-hidden rounded-lg border border-gray-500 p-5 transition-colors ${active ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-200 hover:dark:bg-gray-800'}`}
			type='button'
			onClick={selectItem}
			disabled={active}
		>
			<Icon className='pointer-events-none h-auto w-5' />
			<span className='space-y-2 text-left'>
				<p className='text-base font-medium'>{title}</p>
				<small className='text-sm font-light text-gray-400'>
					{description}
				</small>
			</span>
		</button>
	)
}
