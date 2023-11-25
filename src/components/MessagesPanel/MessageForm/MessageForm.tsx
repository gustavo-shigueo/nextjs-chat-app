import { useEffect, useRef, type FormEvent } from 'react'
import { IoSend } from 'react-icons/io5'
import Button from '../../../components/Button'
import Form from '../../../components/Form'
import Textarea from '../../../components/Textarea'
import { useChats } from '../../../contexts/ChatContext'
import type { MappedChat } from '../../../contexts/ChatContext/ChatContext'
import { api } from '../../../utils/api'

type MessageFormProps = {
	chat: MappedChat
}

export default function MessageForm({ chat }: MessageFormProps) {
	const { pushMessage } = useChats()

	const ref = useRef<HTMLTextAreaElement>(null)
	useEffect(() => {
		ref.current?.focus()

		if (!ref.current) return

		ref.current.value = ''
	}, [chat.id])

	const sendMessage = api.messages.send.useMutation({
		onSuccess: pushMessage,
	})

	function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		if (!ref.current) return

		const text = ref.current.value
		ref.current.value = ''
		if (ref.current.parentElement) {
			ref.current.parentElement.dataset.value = ''
		}

		if (!text?.trim()) return

		if ('Notification' in window && Notification.permission === 'default') {
			Notification.requestPermission().catch(console.error)
		}

		void sendMessage.mutateAsync({
			chatId: chat.id,
			sentAt: new Date(),
			text: text.trim(),
		})
	}

	return (
		<Form
			onSubmit={onSubmit}
			className="z-10 grid-cols-[1fr_auto] items-center pbe-2"
		>
			<Textarea
				name="message"
				placeholder="Digite sua mensagem aqui"
				maxLines={5}
				rows={1}
				ref={ref}
				onKeyDown={e => {
					if (e.key === 'Enter') {
						if (e.shiftKey) {
							return
						}

						e.preventDefault()
						e.currentTarget.form?.querySelector('button')?.click()
					}
				}}
			/>

			<div className="min-bs-[100%]">
				<Button
					type="submit"
					className="aspect-square text-center text-xl"
					aria-label="Enviar"
					title="Enviar"
				>
					<IoSend />
				</Button>
			</div>
		</Form>
	)
}
