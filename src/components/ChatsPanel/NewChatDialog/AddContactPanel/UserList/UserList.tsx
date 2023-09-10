import { useCallback, useEffect, useRef } from 'react'
import Form from '../../../../../components/Form'
import List from '../../../../../components/List'
import Spinner from '../../../../../components/Spinner'
import { useTabs } from '../../../../../components/Tabs/Tabs'
import { api } from '../../../../../utils/api'
import UserListItem from './UserListItem'

type UserListProps = {
	search: string
}

const LIMIT = 50
export default function UserList({ search }: UserListProps) {
	const ref = useRef<HTMLDivElement>(null)
	const { selectedIndex } = useTabs()
	const { data, hasNextPage, fetchNextPage, isFetching, refetch } =
		api.contacts.searchNew.useInfiniteQuery(
			{
				search,
				limit: LIMIT,
			},
			{
				initialCursor: undefined,
				getNextPageParam(lastPage) {
					return lastPage.length === LIMIT + 1
						? lastPage.at(-1)?.createdAt
						: undefined
				},
			}
		)

	const updateUserList = useCallback(async () => {
		if (!hasNextPage || isFetching) return

		await fetchNextPage({ cancelRefetch: true })
	}, [hasNextPage, isFetching, fetchNextPage])

	useEffect(() => {
		const target = ref.current

		if (!target) return

		const intersectionObserver = new IntersectionObserver(([entry]) => {
			if (!entry?.isIntersecting) return

			void updateUserList()
		})

		intersectionObserver.observe(target)

		return () => intersectionObserver.unobserve(target)
	}, [updateUserList])

	useEffect(() => {
		if (selectedIndex === 2) {
			void refetch()
		}
	}, [selectedIndex, refetch])

	const addContact = api.contacts.add.useMutation()

	return (
		<Form
			onSubmit={e => {
				e.preventDefault()
			}}
		>
			<List
				items={data?.pages.flat() ?? []}
				itemKey="id"
				className="divide-y-2 divide-neutral-800 mbs-2 dark:divide-neutral-50"
				renderItem={user => (
					<UserListItem
						user={user}
						onClick={contactId => addContact.mutateAsync({ contactId })}
					/>
				)}
			/>
			{isFetching && (
				<div className="flex justify-center">
					<Spinner size={2} />
				</div>
			)}
			{hasNextPage && <div ref={ref}></div>}
		</Form>
	)
}
