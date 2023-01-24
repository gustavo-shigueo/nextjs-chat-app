import ChatListItem from 'components/ChatListItem'
import Form from 'components/Form'
import Input from 'components/Input'
import List from 'components/List'
import useChatList from 'hooks/useChatList'
import useDebounce from 'hooks/useDebounce'
import IChat from 'interfaces/IChat'
import IUser from 'interfaces/IUser'
import { Dispatch, FC, SetStateAction } from 'react'
import classNames from 'utils/classNames'
import styles from './ChatListPanel.module.scss'

interface ChatListPanelProps {
	chats: IChat[]
	user: IUser | null
	setSelectedChatId: Dispatch<SetStateAction<string>>
	selectedChatId: string
}

const ChatListPanel: FC<ChatListPanelProps> = ({
	chats,
	user,
	setSelectedChatId,
	selectedChatId,
}) => {
	const [search, debouncedSearch, setSearch] = useDebounce('')
	const chatList = useChatList(chats, debouncedSearch, user?.id)

	return (
		<aside
			className={classNames(
				styles['contacts-section'],
				'padding-inline-300',
				'padding-block-200',
				'background-neutral-200'
			)}
		>
			<Form>
				<Input
					value={search}
					onChange={e => setSearch(e.target.value)}
					label="Pesquisar"
					name="search"
					type="search"
				/>
			</Form>

			<h2 className="margin-block-400 font-weight-bold font-size-500">
				Conversas:
			</h2>

			<List
				items={chatList}
				itemKey="id"
				listStyle="none"
				className="padding-100"
				renderItem={chat => (
					<ChatListItem
						chat={chat}
						active={chat.id === selectedChatId}
						setSelectedChatId={setSelectedChatId}
					/>
				)}
			/>
		</aside>
	)
}

export default ChatListPanel
