import ChatHeader from 'components/ChatHeader'
import List from 'components/List'
import MessageListItem from 'components/MessageListItem'
import Message from 'entities/Message'
import style from './MessagePanel.module.scss'
import { FC, useEffect, useRef, useState } from 'react'
import { useAuth } from 'contexts/UserContext'
import MessageInput from 'components/MessageInput'
import IChat from 'interfaces/IChat'
import api from 'services/axios'

interface IMessagePanelProps {
	chat: IChat | undefined
}

const MessagePanel: FC<IMessagePanelProps> = ({ chat }) => {
	const { user } = useAuth()
	const [messages, setMessages] = useState<Message[]>([])
	const listRef = useRef<HTMLUListElement>(null)

	useEffect(() => {
		if (!listRef.current) return

		listRef.current.scrollTo({ top: Number.MAX_SAFE_INTEGER })
	}, [])

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const messages = await api.get<Message[]>(`/messages/${chat?.id}`)
				setMessages(messages.data)
			} catch {
				return setMessages([])
			}
		}

		fetchMessages
	}, [chat?.id])

	if (!user) return null

	return (
		<>
			<ChatHeader chat={chat} />
			<List<Message>
				ref={listRef}
				className={style['message-list']}
				items={messages}
				render={({ senderId, sentAt, text }) => (
					<MessageListItem
						text={text}
						sentAt={sentAt}
						sent={user?.id === senderId}
					/>
				)}
			/>
			{chat && <MessageInput />}
		</>
	)
}

export default MessagePanel
