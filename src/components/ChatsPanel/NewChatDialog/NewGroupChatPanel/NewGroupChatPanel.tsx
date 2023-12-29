import { useState } from 'react'
import Button from '../../../../components/Button'
import Form from '../../../../components/Form'
import Input from '../../../../components/Input'
import { useChats } from '../../../../contexts/ChatContext'
import useDebounce from '../../../../hooks/useDebounce'
import { api } from '../../../../utils/api'
import GroupMemberList from './GroupMemberList'

export default function NewGroupChatPanel() {
	const [selectedUsers, setSelectedUsers] = useState<string[]>([])
	const [name, setName] = useState('')
	const [search, debouncedSearch, setSearch] = useDebounce('', 250)
	const { setSelectedChatId, unshiftChat } = useChats()
	const createGroupChat = api.chats.createGroup.useMutation({
		onSuccess: unshiftChat,
	})

	const toggleUser = (id: string) => {
		setSelectedUsers(state => {
			return state.includes(id) ? state.filter(x => x !== id) : [...state, id]
		})
	}

	const createChat = async () => {
		if (selectedUsers.length === 0 || !name) return

		const chat = await createGroupChat.mutateAsync({
			name,
			members: selectedUsers,
		})

		setSelectedChatId(chat.id)
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

			<Form
				onSubmit={e => {
					e.preventDefault()
					void createChat().then(() => {
						const target = e.target as HTMLFormElement

						target.closest('dialog')?.close()

						setName('')
						setSelectedUsers([])
					})
				}}
			>
				<Input
					name="name"
					value={name}
					onChange={e => setName(e.currentTarget.value)}
					label="Nome do grupo"
					type="text"
				/>

				<GroupMemberList
					search={debouncedSearch}
					toggleUser={toggleUser}
					selectedUsers={selectedUsers}
				/>

				<Button disabled={selectedUsers.length === 0 || !name} type="submit">
					Confirmar
				</Button>
			</Form>
		</>
	)
}
