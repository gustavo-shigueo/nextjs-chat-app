import List from '../../../components/List'
import Spinner from '../../../components/Spinner/Spinner'
import type { MappedChat } from '../../../contexts/ChatContext/ChatContext'
import useMessageList from '../../../hooks/useMessageList'
import MessageListItem from './MessageListItem'

type MessageListProps = {
	chat: MappedChat
}

const LIMIT = 50

export default function MessageList({ chat }: MessageListProps) {
	const { wrapperRef, spinnerRef, hasNextPage } = useMessageList(chat, LIMIT)

	return (
		<section
			className="-z-10 flex flex-col gap-1 overflow-y-auto overflow-x-hidden min-bs-0 plb-2"
			ref={wrapperRef}
			role="tabpanel"
			aria-labelledby={chat.id}
		>
			<div className="flex items-end justify-center" ref={spinnerRef}>
				{hasNextPage && <Spinner size={2} />}
			</div>

			<List
				items={chat.messages}
				className="flex flex-col gap-1 plb-2"
				itemKey="id"
				ordered
				liProps={{ className: 'flex flex-col' }}
				renderItem={(message, index) => (
					<MessageListItem
						chat={chat}
						message={message}
						delay={(chat.messages.length - index) % LIMIT}
						previousMessage={chat.messages[index - 1]}
					/>
				)}
			/>
		</section>
	)
}
