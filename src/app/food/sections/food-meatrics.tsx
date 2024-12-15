import { currentUser } from '@clerk/nextjs/server'
import {
	NutritionCardsSkeleton,
	NutritionGraphicsSkeleton
} from '../_components/skeletons'
import { NutritionCards } from './nutrition-cards'
import { Suspense } from 'react'
import { NutritionGraphicData } from '../_components/nutrition-graphic-data'
import { connection } from 'next/server'

export async function FoodMeatrics() {
	await connection()
	const user = currentUser()
	return (
		<>
			<Suspense fallback={<NutritionCardsSkeleton />}>
				<NutritionCards user={user} />
			</Suspense>
			<Suspense fallback={<NutritionGraphicsSkeleton />}>
				<NutritionGraphicData user={user} />
			</Suspense>
		</>
	)
}
