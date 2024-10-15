import { MessageSquare } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '~/components/ui/dialog'
import AIChatConversation from './ai-chat-conversation'

export default function AIChatDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size='sm' className='flex-grow sm:flex-grow-0'>
					<MessageSquare className='mr-2 h-4 w-4' /> AI Chat
				</Button>
			</DialogTrigger>
			<DialogContent className='rounded-lg max-w-[90%] sm:max-w-xl'>
				<DialogHeader>
					<DialogTitle>Chat with AI</DialogTitle>
					<DialogDescription>
						Tell the AI about your meals, and it will log them for you.
					</DialogDescription>
				</DialogHeader>
				<AIChatConversation />
			</DialogContent>
		</Dialog>
	)
}
