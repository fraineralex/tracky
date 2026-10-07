import { currentUser } from '@clerk/nextjs/server'
import { type Locale } from '~/i18n-config'
import { toExerciseBody } from '~/lib/profile'
import { resolveUserProfile } from '~/server/user-profile'
import ExerciseDialog from './exercise-dialog'

export async function ExerciseDialogGate({ lang }: { lang?: Locale }) {
	const user = await currentUser()
	const profile = user
		? await resolveUserProfile(user.id, user.publicMetadata)
		: null

	return (
		<ExerciseDialog
			lang={lang}
			body={profile ? toExerciseBody(profile) : null}
		/>
	)
}
