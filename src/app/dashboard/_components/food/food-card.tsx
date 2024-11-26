import { Badge } from '~/components/ui/badge'

export default function FoodCardItem({
	item
}: {
	item: {
		name: string
		value: string | number
		percent: string | null
		balance?: string
		color: null | string
	}
}) {
	const getBalanceBadge = (balance: string | undefined) => {
		switch (balance) {
			case 'well':
				return {
					color: 'bg-green-500 dark:bg-green-600',
					text: 'Good'
				}
			case 'moderate':
				return {
					color: 'bg-yellow-500 dark:bg-yellow-600',
					text: 'Fair'
				}
			case 'poor':
				return {
					color: 'bg-red-500 dark:bg-red-600',
					text: 'Poor'
				}
			default:
				return {
					color: 'bg-gray-500 dark:bg-gray-600',
					text: 'Unknown'
				}
		}
	}

	const isCalories = item.name === 'Calories'

	return (
		<div
			key={item.name}
			className='mx-auto flex h-full flex-col items-center justify-between'
		>
			<div className='flex flex-col items-center'>
				{isCalories ? (
					<Badge
						className={`${getBalanceBadge(item.balance).color} mb-2 text-nowrap rounded-full text-xs tracking-tighter text-white sm:text-sm sm:tracking-normal`}
					>
						{getBalanceBadge(item.balance).text}
					</Badge>
				) : item.percent !== null ? (
					<Badge
						className={`${item.color} mb-2 rounded-full text-xs tracking-tighter text-white sm:text-sm sm:tracking-normal`}
					>
						{item.percent}%
					</Badge>
				) : (
					<div className='mb-2 h-6' />
				)}
				<span
					className={`font-bold ${isCalories ? 'text-3xl' : 'text-2xl'} mb-2 text-gray-900 dark:text-gray-100`}
				>
					{item.value}
				</span>
			</div>
			<span className='text-center text-sm text-gray-600 dark:text-gray-400'>
				{item.name}
			</span>
		</div>
	)
}
