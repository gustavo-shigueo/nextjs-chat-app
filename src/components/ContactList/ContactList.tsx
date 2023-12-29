import Form from '../Form'
import List from '../List'
import { api } from '../../utils/api'
import ContactListItem from './ContactListItem'
import type { UserSchema } from '../../server/api/schemas/userSchema'
import { useMemo } from 'react'

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
	const filtered = useMemo(() => {
		if (!data) return null

		return data.filter(x => {
			const searchResult = x.name
				.toLocaleLowerCase()
				.includes(search.toLocaleLowerCase())

			if (!filter) return searchResult

			return searchResult && filter(x)
		})
	}, [data, search, filter])

	if (!data || !filtered) return <></>

	if (data.length === 0) {
		return (
			<Form
				onSubmit={e => {
					e.preventDefault()
					e.currentTarget.closest('dialog')?.close()
				}}
			>
				<strong className="text-center">
					Sua lista de contatos está vazia. Adicione um contato para iniciar uma
					conversa
				</strong>
			</Form>
		)
	}

	if (filtered.length === 0) {
		return (
			<Form
				onSubmit={e => {
					e.preventDefault()
					e.currentTarget.closest('dialog')?.close()
				}}
			>
				<strong className="text-center">
					Nenhum contato corresponde à pesquisa
				</strong>
			</Form>
		)
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
				items={filtered}
				renderItem={contact => (
					<ContactListItem contact={contact} onClick={onContactSelected} />
				)}
			/>
		</Form>
	)
}
