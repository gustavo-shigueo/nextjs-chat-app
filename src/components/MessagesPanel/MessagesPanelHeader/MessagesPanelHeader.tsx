import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { IoCall, IoChevronBack, IoVideocam } from 'react-icons/io5'
import Avatar from '../../../components/Avatar'
import Button from '../../../components/Button/Button'
import {
	CollapsableMenu,
	CollapsableMenuItem,
} from '../../../components/CollapsableMenu'
import { useCall } from '../../../contexts/CallContext'
import { useChats } from '../../../contexts/ChatContext'
import type { MappedChat } from '../../../contexts/ChatContext/ChatContext'
import { formatList } from '../../../utils/formatters/list'
import Dialog from '../../../components/Dialog'
import { useRef } from 'react'
import AddMemberForm from './AddMemberForm'
import Portal from '../../../components/Portal'

type MessagesPanelHeaderProps = {
	chat: MappedChat
}

export default function MessagesPanelHeader({
	chat,
}: MessagesPanelHeaderProps) {
	const { setSelectedChatId } = useChats()
	const { data: session } = useSession()
	const {
		startCall,
		callState: [state],
	} = useCall()
	const { locale } = useRouter()
	const ref = useRef<HTMLDialogElement>(null)

	return (
		<header className="flex items-center justify-start gap-2 border-neutral-600 bg-neutral-200 plb-2 border-be-2 dark:bg-neutral-900">
			<Button
				variant="flat"
				aria-label="Voltar"
				className="aspect-square rounded-full text-neutral-800 shadow-none dark:text-neutral-50"
				onClick={() => setSelectedChatId('')}
				title="Voltar"
			>
				<IoChevronBack />
			</Button>

			<Avatar
				imageUrl={chat.thumbnailUrl}
				name={chat.name}
				moreInfo={
					session && chat.chatType === 'GroupChat'
						? formatList(
								chat.users.length <= 5
									? chat.users.map(u => u.name)
									: [
											...chat.users
												.filter(u => session.user.id !== u.id)
												.map(u => u.name)
												.slice(0, 4),
											`${chat.users.length - 5} outros`,
									  ].filter(Boolean),
								locale
						  )
						: undefined
				}
			/>

			<Button
				className="text-inherit mis-auto"
				variant="flat"
				title="Iniciar chamada de voz"
				aria-label="Iniciar chamada de voz"
				disabled={state !== 'idle'}
				onClick={() => void startCall(chat.id, 'Audio')}
			>
				<IoCall />
			</Button>

			<Button
				className="text-inherit"
				variant="flat"
				title="Iniciar chamada de vídeo"
				aria-label="Iniciar chamada de vídeo"
				disabled={state !== 'idle'}
				onClick={() => void startCall(chat.id, 'Video')}
			>
				<IoVideocam />
			</Button>

			{chat.chatType === 'GroupChat' &&
				chat.creator.id === session?.user.id && (
					<>
					<Portal>
						<Dialog ref={ref}>
							<h3 className="text-center text-2xl font-bold plb-2">
								Adicionar ao grupo:
							</h3>

							<AddMemberForm id={session.user.id} chat={chat} />
						</Dialog>

					</Portal>

						<CollapsableMenu>
							<CollapsableMenuItem
								onClick={() => {
									ref.current?.showModal()
								}}
							>
								Adicionar membro
							</CollapsableMenuItem>
						</CollapsableMenu>
					</>
				)}
		</header>
	)
}
