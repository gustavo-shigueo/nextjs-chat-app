import { useTabs } from '../../../../components/Tabs/Tabs'
import Form from '../../../../components/Form'
import Input from '../../../../components/Input'
import useDebounce from '../../../../hooks/useDebounce'
import ContactList from '../../../ContactList'
import { api } from '../../../../utils/api'
import { useChats } from '../../../../contexts/ChatContext'

export default function AddContactPanel() {
	const [search, debouncedSearch, setSearch] = useDebounce('', 250)
	const { selectedIndex } = useTabs()
	const { chats, setSelectedChatId, unshiftChat } = useChats()

	const createPrivateChat = api.chats.createChat.useMutation({
		onSuccess: unshiftChat,
	})

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
		<>
			<Form>
				<Input
					name="search"
					type="search"
					label="Pesquisar"
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
			</Form>

			{selectedIndex === 0 && (
				<ContactList
					onContactSelected={selectContact}
					search={debouncedSearch}
				/>
			)}
		</>
	)
}
