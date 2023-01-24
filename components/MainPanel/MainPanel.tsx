import ChatListItem from 'components/ChatListItem'
import ChatListPanel from 'components/ChatListPanel'
import Form from 'components/Form'
import Input from 'components/Input'
import List from 'components/List'
import { useAuth } from 'contexts/UserContext'
import useDebounce from 'hooks/useDebounce'
import IChat from 'interfaces/IChat'
import { FC, useMemo, useState } from 'react'
import classNames from 'utils/classNames'
import styles from './MainPanel.module.scss'

interface MainPanelProps {
	chats: IChat[]
}

const getChats = (
	chats: IChat[],
	filter: string,
	userId: string | undefined
): (IChat & { name: string; thumbnailUrl: string })[] => {
	if (!userId || chats.length === 0) return []

	const mapped = chats.map(chat => {
		const defaultData = {
			name: '',
			avatarUrl: '',
		}

		const user = chat.users?.find(user => user.id !== userId) ?? defaultData

		const name = chat.name ?? user.name

		const thumbnailUrl = chat.thumbnailUrl ?? user.avatarUrl

		return { ...chat, name, thumbnailUrl }
	})

	if (!filter) return mapped

	const regex = new RegExp(filter, 'i')

	return mapped.filter(chat => regex.test(chat.name))
}

const MainPanel: FC<MainPanelProps> = ({ chats }) => {
	const { user } = useAuth()
	const [selectedChatId, setSelectedChatId] = useState('')
	const selectedChat = chats.find(c => c.id === selectedChatId)

	return (
		<main className={styles['main-panel']}>
			<ChatListPanel
				chats={chats}
				selectedChatId={selectedChatId}
				setSelectedChatId={setSelectedChatId}
				user={user}
			/>
			<article className={styles['messages-section']}></article>
		</main>
	)
}

export default MainPanel
