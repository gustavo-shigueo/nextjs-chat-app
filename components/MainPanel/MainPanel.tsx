import PeopleListItem from 'components/PeopleListItem'
import Input from 'components/Input'
import List from 'components/List'
import useDebounce from 'hooks/useDebounce'
import IContact from 'interfaces/IContact'
import IPublicUserData from 'interfaces/IPublicUserData'
import { FC, useEffect, useState } from 'react'
import api from 'services/axios'
import style from './MainPanel.module.scss'
import MessagePanel from 'components/MessagePanel'

interface IMainPanelProps {
	contacts: any[]
}

const placeholder = [
	{
		id: '103c33d4-4af1-410c-889a-609f7d2390a9',
		name: 'Teste',
		avatarUrl:
			'https://avatars.dicebear.com/api/bottts/TESTE-172c2347-2c6f-4a4e-9cd2-f3a080c750f2.svg',
		onlineStatus: true,
		lastMessage: {
			id: 'aaaaaaa',
			text: 'Message',
			sentAt: new Date(),
			senderId: '',
			receiverId: '',
		},
	},
	{
		id: '1c0c8f14-3281-4f97-a042-26734676de44',
		name: 'TESTE',
		avatarUrl:
			'https://avatars.dicebear.com/api/bottts/TESTE-172c9347-2c6f-4a4e-9cd3-f3a080c750f2.svg',
		onlineStatus: false,
		lastMessage: {
			id: 'aaaaaaa',
			text: 'Message',
			sentAt: new Date(2022, 5, 11),
			senderId: '',
			receiverId: '',
		},
	},
	{
		id: 'fa01bdd2-40a3-4262-9f98-bebdf8e15f7e',
		name: 'teste',
		avatarUrl:
			'https://avatars.dicebear.com/api/bottts/teste-6537c919-5474-4fb3-a0f3-2c9ac81a8667.svg',
		onlineStatus: true,
		lastMessage: {
			id: 'aaaaaaa',
			text: 'Message',
			sentAt: new Date(2022, 5, 10),
			senderId: '',
			receiverId: '',
		},
	},
]

const MainPanel: FC<IMainPanelProps> = ({ contacts }) => {
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebounce(search)

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
				<List
					className={style['contact-list']}
					items={placeholder.filter(c =>
						c.name.toLowerCase().includes(debouncedSearch.toLowerCase())
					)}
					render={item => <PeopleListItem person={item as any} />}
				/>
			</section>
			<section className={style['messages-section']}>
				<MessagePanel contact={undefined} />
			</section>
		</main>
	)
}

export default MainPanel
