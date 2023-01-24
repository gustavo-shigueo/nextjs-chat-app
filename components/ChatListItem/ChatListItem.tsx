import Image from 'next/image'
import IChat from 'interfaces/IChat'
import { FC, Dispatch, SetStateAction } from 'react'
import styles from './ChatListItem.module.scss'
import { isToday } from 'utils/parseDateDifference/parseDateDifference'
import timeFormatter from 'utils/formatters/time'
import dateFormatter from 'utils/formatters/date'
import classNames from 'utils/classNames'

interface IChatListItemProps {
	chat: IChat & { name: string; thumbnailUrl: string }
	active: boolean
	setSelectedChatId: Dispatch<SetStateAction<string>>
}

const ChatListItem: FC<IChatListItemProps> = ({
	chat,
	active,
	setSelectedChatId,
}) => {
	const { sentAt } = chat.messages[0] ?? { sentAt: null }

	return (
		<button
			onClick={() => setSelectedChatId(chat.id)}
			className={classNames(
				styles.chatListItem,
				'padding-block-300',
				'padding-inline-100',
				'text-align-start',
				'border-radius-100',
				{ [styles.active]: active }
			)}
		>
			<Image
				src={chat.thumbnailUrl}
				alt=""
				width={48}
				height={48}
				className="border-radius-full"
			/>
			<p className="font-size-400 font-weight-bold">{chat.name}</p>
			<p className="font-size-300 text-neutral-700">
				{chat.messages[0]?.text.substring(0, 64)}
				{chat.messages[0]?.text.length > 64 && '...'}
			</p>
			{sentAt && (
				<time
					dateTime={sentAt.toISOString()}
					className="text-neutral-700 font-size-300 text-align-end"
				>
					{isToday(sentAt)
						? timeFormatter.format(sentAt)
						: dateFormatter.format(sentAt)}
				</time>
			)}
		</button>
	)
}

export default ChatListItem
