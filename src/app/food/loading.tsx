import {
	HeaderSkeleton,
	NutritionCardsSkeleton,
	NutritionGraphicsSkeleton
} from './_components/skeletons'

export default function Loading() {
	return (
		<section className='container mx-auto px-0 py-5'>
			<HeaderSkeleton />
			<NutritionCardsSkeleton />
			<NutritionGraphicsSkeleton />
		</section>
	)
}
