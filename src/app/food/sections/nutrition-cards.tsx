import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

export function NutritionCards() {
	return (
		<div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-sm font-medium'>Calories</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>2,100 / 2,500</div>
					<p className='text-xs text-muted-foreground'>84% of daily goal</p>
					<div className='mt-4 h-2 overflow-hidden rounded-full bg-secondary'>
						<div className='h-full bg-primary' style={{ width: '84%' }}></div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-sm font-medium'>Protein</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>75g / 100g</div>
					<p className='text-xs text-muted-foreground'>75% of daily goal</p>
					<div className='mt-4 h-2 overflow-hidden rounded-full bg-secondary'>
						<div className='h-full bg-primary' style={{ width: '75%' }}></div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-sm font-medium'>Carbs</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>200g / 300g</div>
					<p className='text-xs text-muted-foreground'>67% of daily goal</p>
					<div className='mt-4 h-2 overflow-hidden rounded-full bg-secondary'>
						<div className='h-full bg-primary' style={{ width: '67%' }}></div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-sm font-medium'>Fat</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>50g / 70g</div>
					<p className='text-xs text-muted-foreground'>71% of daily goal</p>
					<div className='mt-4 h-2 overflow-hidden rounded-full bg-secondary'>
						<div className='h-full bg-primary' style={{ width: '71%' }}></div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
