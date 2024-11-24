import { currentUser } from '@clerk/nextjs/server'
import { calculateGoalProgress } from '~/lib/calculations'
import { Settings } from './_sections/settings'

export default async function SettingsPageWithModalsComponent() {
	const user = await currentUser()
	if (!user) return null
	const userMetadata = user?.publicMetadata

	const currentWeight =
		userMetadata.weights[userMetadata.weights.length - 1]?.value ?? 0
	const goalProgress = calculateGoalProgress(userMetadata)

	return (
		<Settings
			userMetadata={userMetadata}
			currentWeight={currentWeight}
			goalProgress={goalProgress}
		/>
	)
}
