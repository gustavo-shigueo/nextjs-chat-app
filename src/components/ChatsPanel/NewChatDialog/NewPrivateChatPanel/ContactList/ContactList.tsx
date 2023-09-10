import { useEffect } from 'react'
import Form from '../../../../../components/Form'
import List from '../../../../../components/List'
import { useTabs } from '../../../../../components/Tabs/Tabs'
import { useChats } from '../../../../../contexts/ChatContext'
import { api } from '../../../../../utils/api'
import ContactListItem from './ContactListItem'

type ContactListProps = {
	search: string
}
export default function ContactList({ search }: ContactListProps) {
	const { selectedIndex } = useTabs()
	const { chats, setSelectedChatId, unshiftChat } = useChats()
	const { data, refetch } = api.contacts.list.useQuery()
	const createPrivateChat = api.chats.createChat.useMutation({
		onSuccess: unshiftChat,
	})

	useEffect(() => {
		if (selectedIndex === 0) {
			void refetch()
		}
	}, [selectedIndex, refetch])

	if (!data) return <></>

	const selectContact = async (contactId: string) => {
		const existentChat = chats
			.filter(c => c.chatType === 'PrivateChat')
			.find(c => c.users.some(u => u.id === contactId))

		if (existentChat) {
			setSelectedChatId(existentChat.id)
			return
		}

		await createPrivateChat.mutateAsync({ contactId })
	}

	return (
		<Form
			onSubmit={e => {
				e.preventDefault()
				e.currentTarget.closest('dialog')?.close()
			}}
		>
			<List
				className="divide-y-2 divide-neutral-800 dark:divide-neutral-50"
				itemKey="id"
				items={data.filter(x =>
					x.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
				)}
				renderItem={contact => (
					<ContactListItem contact={contact} onClick={selectContact} />
				)}
			/>
		</Form>
	)
}
