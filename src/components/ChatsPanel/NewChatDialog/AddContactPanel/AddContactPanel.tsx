import Form from '../../../../components/Form'
import Input from '../../../../components/Input'
import useDebounce from '../../../../hooks/useDebounce'
import UserList from './UserList'

export default function AddContactPanel() {
	const [search, debouncedSearch, setSearch] = useDebounce('')

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

			<UserList search={debouncedSearch} />
		</>
	)
}
