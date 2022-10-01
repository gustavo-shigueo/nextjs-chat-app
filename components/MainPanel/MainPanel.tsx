import PeopleListItem from 'components/PeopleListItem'
import Input from 'components/Input'
import List from 'components/List'
import useDebounce from 'hooks/useDebounce'
import { FC, useState } from 'react'
import style from './MainPanel.module.scss'
import MessagePanel from 'components/MessagePanel'
import IChat from 'interfaces/IChat'

interface IMainPanelProps {
	chats: IChat[]
}

const MainPanel: FC<IMainPanelProps> = ({ chats }) => {
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebounce(search)
	const [selectedChatId, setSelectedChatId] = useState('')
	const selectedChat = chats.find(c => c.id === selectedChatId)
	const chatList = chats.filter(c => c.name?.includes(debouncedSearch))

	return (
		<main className={style['main-panel']}>
			<section className={style['contacts-section']}>
				<Input
					label="Pesquisar..."
					type="search"
					value={search}
					onChange={e => setSearch(e.target.value)}
					name="search"
				/>

				<h2>Conversas:</h2>

				{chatList.length > 0 ? (
					<List
						className={style['contact-list']}
						items={chatList}
						render={item => (
							<PeopleListItem
								chat={item}
								onClick={() => setSelectedChatId(item.id)}
							/>
						)}
					/>
				) : (
					<h3 className="margin-block-start-100">
						Nenhuma conversa encontrada...
					</h3>
				)}
			</section>
			<section className={style['messages-section']}>
				<MessagePanel chat={selectedChat} />
			</section>
		</main>
	)
}

export default MainPanel
