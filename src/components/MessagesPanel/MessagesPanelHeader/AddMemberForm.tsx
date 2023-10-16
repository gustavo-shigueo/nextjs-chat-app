import useDebounce from '../../../hooks/useDebounce'
import ContactList from '../../../components/ContactList'
import Form from '../../../components/Form'
import Input from '../../../components/Input'
import type { ChatSchema } from '../../../server/api/schemas/chatSchema'
import { useMemo } from 'react'
import { api } from 'src/utils/api'
import { useChats } from 'src/contexts/ChatContext'

type AddMemberFormProps = {
	id: string
	chat: ChatSchema
}

export default function AddMemberForm({ id, chat }: AddMemberFormProps) {
	const { addUser } = useChats()
	const [search, debouncedSearch, setSearch] = useDebounce('', 250)
	const users = useMemo(() => {
		return chat.users.map(x => x.id).filter(y => y !== id)
	}, [chat, id])

	const addMember = api.chats.addUser.useMutation()

	const onContactSelected = async (contactId: string) => {
		const data = await addMember.mutateAsync({
			chatId: chat.id,
			userId: contactId,
		})

		const user = data.users.find(x => x.id === contactId)

		if (user) {
			addUser(chat.id, user)
		}
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

			<ContactList
				onContactSelected={onContactSelected}
				search={debouncedSearch}
				filter={x => !users.includes(x.id)}
			/>
		</>
	)
}
