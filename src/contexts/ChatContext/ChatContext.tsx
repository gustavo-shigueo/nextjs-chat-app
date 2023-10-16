import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from 'react'
import type { ChatSchema } from '../../server/api/schemas/chatSchema'
import type { MessageSchema } from '../../server/api/schemas/messageSchema'
import { api } from '../../utils/api'
import {
	appendMessageToEnd,
	appendMessagesToStart,
	mapChatNames,
	sortChats,
} from './helpers'
import type { UserSchema } from '../../server/api/schemas/userSchema'

type ChatProviderProps = {
	children: ReactNode
	chats: ChatSchema[]
	userId: string
}

export type MappedChat = ReturnType<ReturnType<typeof mapChatNames>>

type ChatContextData = {
	chats: MappedChat[]
	selectedChat: MappedChat | undefined
	selectedChatId: string
	addUser: (chatId: string, user: UserSchema) => void
	setSelectedChatId: Dispatch<SetStateAction<string>>
	pushMessage: (message: MessageSchema) => void
	unshiftMessages: (chatId: string, messages: MessageSchema[]) => void
	unshiftChat: (chat: ChatSchema) => void
}

type NotificationData = { chatId: string }

const ChatContext = createContext<ChatContextData>({} as ChatContextData)
export const useChats = () => useContext(ChatContext)

export function ChatProvider({
	chats: initialChats,
	children,
	userId,
}: ChatProviderProps) {
	const [data, setData] = useState<ChatSchema[]>(initialChats)
	const [selectedChatId, setSelectedChatId] = useState('')

	const chats = useMemo(
		() => data.map(mapChatNames(userId)).sort(sortChats),
		[data, userId]
	)

	const unshiftChat = useCallback((chat: ChatSchema) => {
		setData(state => [chat, ...state])
		setSelectedChatId(chat.id)
	}, [])

	const addUser = useCallback((chatId: string, user: UserSchema) => {
		setData(state =>
			state.map(x =>
				x.id === chatId ? { ...x, users: [...x.users, user] } : x
			)
		)
	}, [])

	const selectedChat = useMemo(
		() => chats.find(c => c.id === selectedChatId),
		[chats, selectedChatId]
	)

	const sendNotification = useCallback(
		(message: MessageSchema) => {
			const chat = chats.find(c => c.id === message.chatId)

			if (!chat) return

			const notification = new Notification(
				`Nova mensagem - ${chat.name ?? ''}`,
				{
					tag: chat.id,
					vibrate: 1,
					silent: false,
					timestamp: message.sentAt.valueOf(),
					data: { chatId: chat.id } as NotificationData,
					body: `${message.text.substring(0, 100)}${
						message.text.length > 100 ? '...' : ''
					}`,
				}
			)

			notification.addEventListener(
				'click',
				() => {
					setSelectedChatId((notification.data as NotificationData).chatId)
					window.focus()
					notification.close()
				},
				{ once: true }
			)
		},
		[chats]
	)

	const pushMessage = useCallback(
		(message: MessageSchema) => {
			setData(state => state.map(appendMessageToEnd(message)))

			if (message.chatId !== selectedChatId || !document.hasFocus()) {
				sendNotification(message)
			}
		},
		[selectedChatId, sendNotification]
	)

	const unshiftMessages = useCallback(
		(chatId: string, messages: MessageSchema[]) => {
			setData(state => state.map(appendMessagesToStart(chatId, messages)))
		},
		[]
	)

	api.chats.newChat.useSubscription(undefined, {
		onData: c => setData(state => [c, ...state]),
	})

	api.chats.newMember.useSubscription(undefined, {
		onData(c) {
			setData(state => {
				return state.some(chat => chat.id === c.id)
					? state.map(chat => (chat.id === c.id ? c : chat))
					: [c, ...state]
			})
		},
	})

	api.messages.receive.useSubscription(undefined, { onData: pushMessage })

	useEffect(() => {
		void Notification.requestPermission()
	}, [])

	return (
		<ChatContext.Provider
			value={{
				chats,
				unshiftChat,
				addUser,
				pushMessage,
				unshiftMessages,
				selectedChat,
				selectedChatId,
				setSelectedChatId,
			}}
		>
			{children}
		</ChatContext.Provider>
	)
}
