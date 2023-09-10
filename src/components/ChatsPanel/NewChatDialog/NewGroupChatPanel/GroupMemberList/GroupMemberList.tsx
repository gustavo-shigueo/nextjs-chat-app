import { useEffect } from 'react'
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

	useEffect(() => {
		if (selectedIndex === 1) {
			void refetch()
		}
	}, [selectedIndex, refetch])

	if (!data) return <></>

	return (
		<List
			className="divide-y-2 divide-neutral-800 dark:divide-neutral-50"
			itemKey="id"
			items={data.filter(x =>
				x.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
			)}
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
