import { Message } from '~/app/food/_actions'

export const fakeLogMealAI = async (conversation: Message[]) => {
	const response = [
		...conversation,
		{
			role: 'assistant',
			content: 'I have generated the food consumption data.'
		}
	] satisfies Message[]

	return response
}
