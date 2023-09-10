import { useEffect, useMemo, useRef } from 'react'
import { IoAdd } from 'react-icons/io5'
import { useChats } from '../../contexts/ChatContext'
import useDebounce from '../../hooks/useDebounce'
import useMediaQuery from '../../hooks/useMediaQuery'
import Button from '../Button'
import Form from '../Form'
import Input from '../Input'
import List from '../List'
import ChatListItem from './ChatListItem'
import NewChatDialog from './NewChatDialog'

export default function ChatsPanel() {
	const ref = useRef<HTMLDivElement>(null)
	const dialogRef = useRef<HTMLDialogElement>(null)
	const { chats, selectedChatId, setSelectedChatId } = useChats()
	const small = useMediaQuery('(width < 40em)')
	const [search, debouncedSearch, setSearch] = useDebounce('')

	const chatList = useMemo(() => {
		const regex = new RegExp(debouncedSearch, 'i')
		return chats.filter(c => regex.test(c.name ?? ''))
	}, [chats, debouncedSearch])

	useEffect(() => {
		if (!ref.current) return

		if (!small) {
			return void ref.current.animate(
				{ translate: '0 0', scale: 1 },
				{ fill: 'forwards', duration: 0 }
			)
		}

		ref.current.animate(
			ref.current.getAttribute('data-inert') === 'true'
				? { translate: '-150vw 5%', scale: 0.95 }
				: { translate: '0 0', scale: 1 },
			{ fill: 'forwards', duration: 0 }
		)
	}, [small])

	useEffect(() => {
		if (!ref.current || ref.current.getAttribute('data-mobile') !== 'true') {
			return
		}

		const keyframes = selectedChatId
			? [
					{ translate: '0 5%', scale: 0.95, offset: 0.25 },
					{ translate: '-150vw 5%', scale: 0.95 },
			  ]
			: [
					{ translate: '-150vw 5%', scale: 0.95, offset: 0 },
					{ translate: '0 5%', scale: 0.95, offset: 0.75 },
					{ translate: '0 0', scale: 1 },
			  ]

		ref.current.animate(keyframes, { fill: 'forwards', duration: 350 })
	}, [selectedChatId])

	return (
		<aside
			ref={ref}
			data-mobile={small ? 'true' : 'false'}
			data-inert={small && selectedChatId ? 'true' : 'false'}
			inert={small && selectedChatId ? 'true' : undefined}
			className="z-10 flex flex-col gap-4 overflow-hidden bg-neutral-200 plb-2 data-[mobile=true]:absolute data-[mobile=true]:left-0 data-[mobile=true]:bs-full data-[mobile=true]:is-full data-[mobile=true]:[grid-column:_1] dark:bg-neutral-900"
		>
			<NewChatDialog ref={dialogRef} />

			<Form className="pli-3">
				<Input
					name="search"
					type="search"
					label="Pesquisar"
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
			</Form>

			<span className="flex items-center gap-2 pli-3 pbs-4 border-bs-2 border-bs-neutral-500">
				<h2 className="text-xl font-bold">Conversas:</h2>

				<Button
					className="!text-inherit mis-auto"
					onClick={() => {
						void dialogRef.current?.showModal()
					}}
					variant="flat"
					title="Nova conversa"
					aria-label="Nova conversa"
				>
					<IoAdd />
				</Button>
			</span>

			<List
				itemKey="id"
				items={chatList}
				role="tablist"
				className="flex flex-col gap-4 overflow-auto border-none pli-3 plb-1 [&_>_:last-child_>_button]:after:hidden [&_>_li_>_button]:after:content-['']"
				listStyle="none"
				renderItem={chat => (
					<ChatListItem
						chat={chat}
						active={chat.id === selectedChatId}
						setSelectedChatId={setSelectedChatId}
					/>
				)}
			/>
		</aside>
	)
}
