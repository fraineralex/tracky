'use client'

import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { DialogFooter } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Bot, Loader, Send } from 'lucide-react'
import { Message } from '../_actions'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { useUser } from '@clerk/nextjs'
import { SuccessLogCard } from './success-log-card'

export const maxDuration = 30

interface AIChatConversationProps {
	action: (messages: Message[]) => Promise<Message[]>
	placeholder: string
	instruction: string
}

export default function AIChatConversation({
	action,
	placeholder,
	instruction
}: AIChatConversationProps) {
	const { user } = useUser()
	const [conversation, setConversation] = useState<Message[]>([])
	const [input, setInput] = useState('')
	const [loading, setLoading] = useState(false)
	if (!user) return null

	const handleSend = async () => {
		if (!input.trim()) return
		setLoading(true)
		setInput('')
		const newConversation = [
			...conversation,
			{ role: 'user', content: input }
		] satisfies Message[]
		setConversation(newConversation)
		const response = await action(newConversation)
		setConversation(response)
		setLoading(false)
	}

	const fullNameShort = `${user.firstName?.[0] ?? ''} ${user.lastName?.[0] ?? ''}.`
	return (
		<>
			<ScrollArea
				className={`${conversation.length > 0 ? 'h-[400px]' : 'h-[100px]'} pr-4`}
			>
				<>
					{conversation.map((message, index) => (
						<>
							{message.successLogData &&
								message.successLogData.map((data, index) => (
									<SuccessLogCard key={index} {...data} />
								))}
							{!message.successLogData && (
								<div
									key={index}
									className={`mb-4 flex items-start space-x-2 border-b border-muted-foreground/60 pb-4 ${
										message.role === 'user' ? 'justify-end' : 'justify-start'
									}`}
								>
									{message.role === 'assistant' && (
										<Bot className='mt-1 h-6 w-6 text-green-500' />
									)}
									<div className={`max-w-[80%] rounded-lg p-2 text-sm`}>
										{message.content}
									</div>
									{message.role === 'user' && (
										<Avatar className='mt-1 h-7 w-7'>
											<AvatarImage src={user.imageUrl} />
											<AvatarFallback>{fullNameShort}</AvatarFallback>
										</Avatar>
									)}
								</div>
							)}
						</>
					))}

					{loading && (
						<div className='bg-red flex items-center justify-start space-x-2 text-muted-foreground'>
							<Loader className='me-2 mt-1 animate-spin' />
							Analyzing...
						</div>
					)}
				</>
			</ScrollArea>

			<DialogFooter>
				<div className='w-full'>
					<article className='flex items-center space-x-2 self-center'>
						<Input
							value={input}
							onChange={e => setInput(e.target.value)}
							placeholder={placeholder}
							onKeyDown={e => e.key === 'Enter' && handleSend()}
							className='h-12 flex-grow'
						/>
						<Button onClick={handleSend} size='icon'>
							<Send className='h-4 w-4' />
						</Button>
					</article>
					<small className='text-xs leading-tight tracking-tight text-muted-foreground'>
						{instruction}
					</small>
				</div>
			</DialogFooter>
		</>
	)
}
