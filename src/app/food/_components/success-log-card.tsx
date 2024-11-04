'use client'

import { Card, CardContent } from '~/components/ui/card'
import { CheckCircle } from 'lucide-react'
import { SuccessLogData } from '~/types'

const colors = ['#3b82f6', '#22c55e', '#eab308']

export function SuccessLogCard({
	title,
	subTitle,
	items,
	successMessage,
	subTitleUnit
}: SuccessLogData) {
	return (
		<Card className='mx-auto w-full max-w-md overflow-hidden rounded-xl border-green-200 bg-green-50 shadow-lg'>
			<CardContent className='p-4'>
				<div className='mb-4 flex items-center justify-between'>
					<div className='flex items-center'>
						<CheckCircle className='mr-2 h-6 w-6 text-green-500' />
						<span className='font-medium text-green-700'>{successMessage}</span>
					</div>
				</div>
				<div className='flex items-center justify-between'>
					<h3 className='mb-1 text-lg font-semibold text-gray-800'>{title}</h3>
					<div className='flex items-baseline'>
						<span className='text-2xl font-bold text-gray-900 capitalize'>{subTitle}</span>
						{subTitleUnit && (
							<span className='ml-1 text-sm text-gray-500'>{subTitleUnit}</span>
						)}
					</div>
				</div>
				<div className='mt-4 flex justify-between'>
					{items.map((nutrient, index) => (
						<div key={index} className='flex items-center'>
							<div
								className='mr-2 h-3 w-3 rounded-full'
								style={{ backgroundColor: colors[index] }}
							></div>
							<span className='text-xs text-gray-600 md:text-sm'>
								<span className='font-medium'>{nutrient.name}:</span> {nutrient.amount}
							</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
