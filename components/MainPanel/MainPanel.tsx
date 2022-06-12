import ContactListItem from 'components/PeopleListItem'
import Input from 'components/Input'
import List from 'components/List'
import useDebounce from 'hooks/useDebounce'
import IContact from 'interfaces/IContact'
import IPublicUserData from 'interfaces/IPublicUserData'
import { FC, useEffect, useState } from 'react'
import api from 'services/axios'
import style from './MainPanel.module.scss'

interface IMainPanelProps {
	contacts: IContact[]
}

const placeholder = [
	{
		id: '103c33d4-4af1-410c-889a-609f7d2390a9',
		name: 'Gustavo Shigueo',
		avatarUrl:
			'https://lh3.googleusercontent.com/a-/AOh14Gj6zOKw_JuB01EOqUpEUPilCNeZ42ouHCvc2Z76cw=s96-c',
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
	const [selectedUser, setSelectedUser] = useState()
	const [people, setPeople] = useState([])
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebounce(search)

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				if (!debouncedSearch) return setPeople([])
				const { data } = await api.get(`/users/search/${debouncedSearch}`)
				setPeople(data)
			} catch (e) {
				console.error(e)
			}
		}

		fetchUsers()
	}, [debouncedSearch])

	return (
		<main className={style['main-panel']}>
			<section className={style['contacts-section']}>
				<Input
					label="Pesquisar..."
					type="search"
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>

				<h2>Contatos:</h2>
				<List<IContact>
					className={style['contact-list']}
					items={placeholder.filter(c =>
						c.name.toLowerCase().includes(debouncedSearch.toLowerCase())
					)}
					render={item => <ContactListItem person={item} />}
				/>
				{!!people.length && (
					<>
						<h2>Pessoas:</h2>
						<List<IPublicUserData>
							className={style['contact-list']}
							items={people}
							render={person => <ContactListItem person={person} />}
						/>
					</>
				)}
			</section>
			<section className={style['messages-section']}></section>
		</main>
	)
}

export default MainPanel
