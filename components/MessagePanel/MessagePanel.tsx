import ContactHeader from 'components/ContactHeader'
import List from 'components/List'
import MessageListItem from 'components/MessageListItem'
import Message from 'entities/Message'
import IContact from 'interfaces/IContact'
import IMessage from 'interfaces/IMessage'
import style from './MessagePanel.module.scss'
import { FC, useState } from 'react'
import { useAuth } from 'contexts/UserContext'
import MessageInput from 'components/MessageInput'

interface IMessagePanelProps {
	contact: IContact | undefined
}

const placeholder: IMessage[] = [
	{
		id: 'asdgeiwo',
		receiverId: 'asdag',
		senderId: '103c33d4-4af1-410c-889a-609f7d2390a9',
		sentAt: new Date(2022, 5, 15, 15, 35),
		text: 'Mensagem de teste',
	},
	{
		id: 'asdgeiwo',
		receiverId: 'asdag',
		senderId: '103c33d4-4af1-410c-889a-609f7d2390a9',
		sentAt: new Date(2022, 5, 15, 15, 35),
		text: 'Mensagem de teste',
	},
	{
		id: 'asdgeiwo',
		senderId: 'asdag',
		receiverId: '103c33d4-4af1-410c-889a-609f7d2390a9',
		sentAt: new Date(2022, 5, 15, 15, 37),
		text: 'Resposta de teste',
	},
	{
		id: 'asdgeiwo',
		senderId: 'asdag',
		receiverId: '103c33d4-4af1-410c-889a-609f7d2390a9',
		sentAt: new Date(2022, 5, 15, 15, 37),
		text: 'Resposta de teste',
	},
	{
		id: 'asdgeiwo',
		senderId: 'asdag',
		receiverId: '103c33d4-4af1-410c-889a-609f7d2390a9',
		sentAt: new Date(2022, 5, 15, 15, 37),
		text: 'Resposta de teste',
	},
	{
		id: 'asdgeiwo',
		senderId: 'asdag',
		receiverId: '103c33d4-4af1-410c-889a-609f7d2390a9',
		sentAt: new Date(2022, 5, 15, 15, 37),
		text: 'Resposta de teste',
	},
	{
		id: 'asdgeiwo',
		receiverId: 'asdag',
		senderId: '103c33d4-4af1-410c-889a-609f7d2390a9',
		sentAt: new Date(2022, 5, 15, 15, 35),
		text: 'Mensagem de teste',
	},
	{
		id: 'asdgeiwo',
		receiverId: 'asdag',
		senderId: '103c33d4-4af1-410c-889a-609f7d2390a9',
		sentAt: new Date(2022, 5, 15, 15, 35),
		text: 'Mensagem de teste',
	},
	{
		id: 'asdgeiwo',
		receiverId: 'asdag',
		senderId: '103c33d4-4af1-410c-889a-609f7d2390a9',
		sentAt: new Date(2022, 5, 15, 15, 35),
		text: 'Mensagem de teste',
	},
]

const MessagePanel: FC<IMessagePanelProps> = ({ contact }) => {
	const { user } = useAuth()
	const [messages, setMessages] = useState<Message[]>([])

	if (!contact || !user) return null

	return (
		<>
			<ContactHeader contact={contact} />
			<List<IMessage>
				className={style['message-list']}
				items={placeholder}
				render={({ senderId, sentAt, text }) => (
					<MessageListItem
						text={text}
						sentAt={sentAt}
						sent={user?.id === senderId}
					/>
				)}
			/>
			<MessageInput />
		</>
	)
}

export default MessagePanel
