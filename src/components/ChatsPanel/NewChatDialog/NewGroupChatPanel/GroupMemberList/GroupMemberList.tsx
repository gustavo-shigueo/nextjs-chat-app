import { useEffect, useMemo } from 'react'
import List from '../../../../../components/List'
import { useTabs } from '../../../../../components/Tabs/Tabs'
import { api } from '../../../../../utils/api'
import GroupMemberListItem from './GroupMemberListItem'

type GroupMemberListProps = {
	search: string
	selectedUsers: string[]
	toggleUser: (id: string) => void
}

export default function GroupMemberList({
	search,
	selectedUsers,
	toggleUser,
}: GroupMemberListProps) {
	const { selectedIndex } = useTabs()
	const { data, refetch } = api.contacts.list.useQuery()
	const filtered = useMemo(() => {
		if (!data) return null

		return data.filter(x =>
			x.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
		)
	}, [data, search])

	useEffect(() => {
		if (selectedIndex === 1) {
			void refetch()
		}
	}, [selectedIndex, refetch])

	if (!data || !filtered) return <></>

	if (data.length === 0) {
		return (
			<strong className="text-center">
				Sua lista de contatos está vazia. Adicione contatos para criar um grupo
			</strong>
		)
	}

	if (filtered.length === 0) {
		return (
			<strong className="text-center">
				Nenhum contato corresponde à pesquisa
			</strong>
		)
	}

	return (
		<List
			className="divide-y-2 divide-neutral-800 dark:divide-neutral-50"
			itemKey="id"
			items={filtered}
			renderItem={contact => (
				<GroupMemberListItem
					checked={selectedUsers.includes(contact.id)}
					contact={contact}
					onChange={() => toggleUser(contact.id)}
				/>
			)}
		/>
	)
}
