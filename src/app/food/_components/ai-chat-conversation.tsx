'use client'

import { useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import { DialogFooter } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Bot, Camera, Image as ImageIcon, Loader, Send } from 'lucide-react'
import { DescribeImageInput, Message } from '../_actions'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { useUser } from '@clerk/nextjs'
import { SuccessLogCard } from './success-log-card'
import Image from 'next/image'

export const maxDuration = 30

interface AIChatConversationProps {
	action: (messages: Message[]) => Promise<Message[]>
	placeholder: string
	instruction: string
	describeImage?: (payload: DescribeImageInput) => Promise<string>
}

export default function AIChatConversation({
	action,
	placeholder,
	instruction,
	describeImage
}: AIChatConversationProps) {
	const { user } = useUser()
	const [conversation, setConversation] = useState<Message[]>([])
	const [input, setInput] = useState('')
	const [loading, setLoading] = useState(false)
	const cameraInputRef = useRef<HTMLInputElement>(null)
	const galleryInputRef = useRef<HTMLInputElement>(null)
	if (!user) return null

	const fileToDataUrl = (file: File) =>
		new Promise<string>((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = () => resolve(reader.result as string)
			reader.onerror = () => reject(reader.error)
			reader.readAsDataURL(file)
		})

	const handleSend = async () => {
		if (!input.trim() || loading) return
		setLoading(true)
		setInput('')
		const newConversation = [
			...conversation,
			{ role: 'user', content: input }
		] satisfies Message[]
		setConversation(newConversation)
		try {
			const response = await action(newConversation)
			setConversation(response)
		} finally {
			setLoading(false)
		}
	}

	const handleMediaSelection = async (
		files: FileList | null,
		defaultMessage: string
	) => {
		const file = files?.[0]
		if (!file || loading) return
		setLoading(true)
		try {
			const dataUrl = await fileToDataUrl(file)
			const typedDescription = input.trim()
			let generatedDescription = ''
			if (!typedDescription && describeImage) {
				try {
					generatedDescription = await Promise.race([
						describeImage({
							dataUrl,
							mimeType: file.type
						}),
						new Promise<string>(resolve => setTimeout(() => resolve(''), 12000))
					])
				} catch (error) {
					console.error('Error describing meal image:', error)
				}
			}
			const description =
				typedDescription || generatedDescription || defaultMessage
			setInput('')
			const newConversation = [
				...conversation,
				{
					role: 'user',
					content: description,
					image: {
						dataUrl,
						mimeType: file.type
					}
				}
			] satisfies Message[]
			setConversation(newConversation)
			const response = await action(newConversation)
			setConversation(response)
		} finally {
			setLoading(false)
		}
	}

	const fullNameShort = `${user.firstName?.[0] ?? ''} ${user.lastName?.[0] ?? ''}.`
	return (
		<>
			<ScrollArea
				className={`${conversation.length > 0 ? 'h-[400px]' : 'h-[100px]'} pr-4`}
			>
				<>
					{conversation.map((message, index) => (
						<div key={index}>
							{message.successLogData &&
								message.successLogData.map((data, index) => (
									<div key={index} className={`${index === (message.successLogData?.length || 0) - 1 ? 'border-b border-muted-foreground/60 mb-4' : ''}`}>
										<SuccessLogCard {...data} />
									</div>
								))}
							{!message.successLogData && (
								<article
									key={index}
									className={`mb-4 flex items-start space-x-2 border-b border-muted-foreground/60 pb-4 ${
										message.role === 'user' ? 'justify-end' : 'justify-start'
									}`}
								>
									{message.role === 'assistant' && (
										<Bot className='mt-1 h-6 w-6 text-green-500' />
									)}
									<div className='max-w-[80%] rounded-lg p-2 text-sm capitalize'>
										{message.content}
										{message.image && (
											<Image
												width={300}
												height={160}
												src={message.image.dataUrl}
												alt='Meal attachment'
												className='mt-2 max-h-40 w-full rounded-md object-cover'
											/>
										)}
									</div>
									{message.role === 'user' && (
										<Avatar className='mt-1 h-7 w-7'>
											<AvatarImage src={user.imageUrl} />
											<AvatarFallback>{fullNameShort}</AvatarFallback>
										</Avatar>
									)}
								</article>
							)}
						</div>
					))}

					{loading && (
						<div className='bg-red flex items-center justify-start space-x-2 py-2 text-muted-foreground'>
							<Loader className='me-2 mt-1 animate-spin' />
							Analyzing...
						</div>
					)}
				</>
			</ScrollArea>

			<DialogFooter>
				<div className='w-full'>
					<input
						ref={cameraInputRef}
						type='file'
						accept='image/*'
						capture='environment'
						className='hidden'
						onChange={async event => {
							await handleMediaSelection(event.target.files, 'Meal photo')
							if (event.target) event.target.value = ''
						}}
					/>
					<input
						ref={galleryInputRef}
						type='file'
						accept='image/*'
						className='hidden'
						onChange={async event => {
							await handleMediaSelection(event.target.files, 'Meal image')
							if (event.target) event.target.value = ''
						}}
					/>
					<article className='flex items-center space-x-2 self-center'>
						<div className='flex items-center space-x-1'>
							<Button
								type='button'
								variant='outline'
								size='icon'
								onClick={() => cameraInputRef.current?.click()}
								disabled={loading}
							>
								<Camera className='h-4 w-4' />
							</Button>
							<Button
								type='button'
								variant='outline'
								size='icon'
								onClick={() => galleryInputRef.current?.click()}
								disabled={loading}
							>
								<ImageIcon className='h-4 w-4' />
							</Button>
						</div>
						<Input
							value={input}
							onChange={e => setInput(e.target.value)}
							placeholder={placeholder}
							onKeyDown={e => e.key === 'Enter' && handleSend()}
							className='h-12 flex-grow'
							disabled={loading}
						/>
						<Button
							type='button'
							onClick={handleSend}
							size='icon'
							disabled={loading}
						>
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
