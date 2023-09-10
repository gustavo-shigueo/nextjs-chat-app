import Form from '../../../../components/Form'
import Input from '../../../../components/Input'
import useDebounce from '../../../../hooks/useDebounce'
import ContactList from './ContactList'

export default function AddContactPanel() {
	const [search, debouncedSearch, setSearch] = useDebounce('', 250)

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

			<ContactList search={debouncedSearch} />
		</>
	)
}
