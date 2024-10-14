'use client'

import { useState } from 'react'
import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Bot, MessageSquare, Send, User } from 'lucide-react'

type Message = {
	role: 'user' | 'ai'
	content: string
}

export default function AIChatDialog() {
	const [isOpen, setIsOpen] = useState(false)
	const [messages, setMessages] = useState<Message[]>([])
	const [input, setInput] = useState('')

	const handleSend = () => {
		if (input.trim()) {
			setMessages([...messages, { role: 'user', content: input }])
			// Simulate AI response
			setTimeout(() => {
				setMessages(prev => [
					...prev,
					{
						role: 'ai',
						content:
							"I've logged your meal: " +
							input +
							". Is there anything else you'd like to add?"
					}
				])
			}, 1000)
			setInput('')
		}
	}

	return (
		<>
			<Button
				size='sm'
				className='flex-grow sm:flex-grow-0'
				onClick={() => setIsOpen(true)}
			>
				<MessageSquare className='mr-2 h-4 w-4' /> AI Chat
			</Button>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Chat with AI</DialogTitle>
						<DialogDescription>
							Tell the AI about your meals, and it will log them for you.
						</DialogDescription>
					</DialogHeader>
					<ScrollArea className='h-[300px] pr-4'>
						{messages.map((message, index) => (
							<div
								key={index}
								className={`mb-4 flex items-start space-x-2 ${
									message.role === 'user' ? 'justify-end' : 'justify-start'
								}`}
							>
								{message.role === 'ai' && (
									<Bot className='mt-1 h-6 w-6 text-blue-500' />
								)}
								<div
									className={`max-w-[80%] rounded-lg p-2 ${
										message.role === 'user'
											? 'bg-primary text-primary-foreground'
											: 'bg-muted'
									}`}
								>
									{message.content}
								</div>
								{message.role === 'user' && (
									<User className='mt-1 h-6 w-6 text-green-500' />
								)}
							</div>
						))}
					</ScrollArea>
					<DialogFooter className='flex items-center space-x-2'>
						<Input
							value={input}
							onChange={e => setInput(e.target.value)}
							placeholder='Type your message here...'
							onKeyPress={e => e.key === 'Enter' && handleSend()}
							className='flex-grow'
						/>
						<Button onClick={handleSend} size='icon'>
							<Send className='h-4 w-4' />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
