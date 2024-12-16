import {
	ExerciseCardSkeleton,
	ExerciseGraphicsSkeleton,
	HeaderSkeleton
} from './_components/skeletons'

export default function Loading() {
	return (
		<section className='mx-auto min-h-screen w-full px-0 md:py-5'>
			<HeaderSkeleton />
			<ExerciseCardSkeleton />
			<ExerciseGraphicsSkeleton />
		</section>
	)
}
