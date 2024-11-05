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
import { Message } from '../_actions'

interface AIChatDialogProps {
	action: (messages: Message[]) => Promise<Message[]>
	placeholder: string
	title: string
	description: string
	instruction: string
}

export default function AIChatDialog({
	action,
	placeholder,
	title,
	description,
	instruction
}: AIChatDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size='sm' className='flex-grow sm:flex-grow-0'>
					<MessageSquare className='mr-2 h-4 w-4' /> AI Chat
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-[90%] rounded-lg sm:max-w-xl'>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<AIChatConversation
					action={action}
					placeholder={placeholder}
					instruction={instruction}
				/>
			</DialogContent>
		</Dialog>
	)
}
