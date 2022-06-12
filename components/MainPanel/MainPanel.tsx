import ContactListItem from 'components/ContactListItem'
import List from 'components/List'
import IContact from 'interfaces/IContact'
import { FC, useState } from 'react'
import style from './MainPanel.module.scss'

interface IMainPanelProps {
	contacts: IContact[]
}

const MainPanel: FC<IMainPanelProps> = ({ contacts }) => {
	const [selectedContact, setSelectedContact] = useState()

	return (
		<main className={style['main-panel']}>
			<section className={style['contacts-section']}>
				<List<IContact>
					className={style['contact-list']}
					items={[
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
					]}
					render={item => <ContactListItem contact={item} />}
				/>
			</section>
			<div></div>
		</main>
	)
}

export default MainPanel
