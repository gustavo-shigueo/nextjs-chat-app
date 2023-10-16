import Form from '../Form'
import List from '../List'
import { api } from '../../utils/api'
import ContactListItem from './ContactListItem'
import type { UserSchema } from '../../server/api/schemas/userSchema'

type ContactListProps = {
	search: string
	filter?: (contact: UserSchema) => boolean
	onContactSelected: (contactId: string) => Promise<void>
}

export default function ContactList({
	search,
	onContactSelected,
	filter,
}: ContactListProps) {
	const { data } = api.contacts.list.useQuery()

	if (!data) return <></>

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
				items={data.filter(x => {
					const searchResult = x.name
						.toLocaleLowerCase()
						.includes(search.toLocaleLowerCase())

					if (!filter) return searchResult

					return searchResult && filter(x)
				})}
				renderItem={contact => (
					<ContactListItem contact={contact} onClick={onContactSelected} />
				)}
			/>
		</Form>
	)
}
