import { useSession } from 'next-auth/react'
import { useChats } from '../../contexts/ChatContext'
import useMediaQuery from '../../hooks/useMediaQuery'
import MessageForm from './MessageForm'
import MessageList from './MessageList/MessageList'
import MessagesPanelHeader from './MessagesPanelHeader'

export default function MessagesPanel() {
	const { data: session } = useSession()
	const { selectedChat: chat } = useChats()
	const small = useMediaQuery('(width < 40em)')

	return (
		<section
			data-mobile={small}
			inert={small && !chat?.id ? 'true' : undefined}
			data-inert={small && !chat?.id ? 'true' : 'false'}
			className="isolate grid grid-rows-[auto_1fr_auto] min-bs-0 data-[mobile=true]:absolute data-[mobile=true]:bs-full data-[mobile=true]:is-full data-[mobile=true]:[grid-column:_1] [&_>_*]:pli-4"
		>
			{chat && session?.user.id && (
				<>
					<MessagesPanelHeader chat={chat} />

					<MessageList chat={chat} />

					<MessageForm chat={chat} />
				</>
			)}
		</section>
	)
}
