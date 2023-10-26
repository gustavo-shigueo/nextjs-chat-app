import Image from 'next/image'
import { useRouter } from 'next/router'
import type { MappedChat } from '../../contexts/ChatContext/ChatContext'
import { isToday } from '../../utils/date/isToday'
import { isYesterday } from '../../utils/date/isYesterday'
import { formatDate, formatTime } from '../../utils/formatters/dateTime'
import { formatRelativeDate } from '../../utils/formatters/relativeDateTime'

type IChatListItemProps = {
	chat: MappedChat
	active: boolean
}

function formatLastMessageTime(date: Date, locale: string | undefined) {
	if (isToday(date)) return formatTime(date, locale)

	if (isYesterday(date)) {
		return formatRelativeDate(-1, 'day', locale).replace(/^[a-z]/, c =>
			c.toUpperCase()
		)
	}

	return formatDate(date, locale)
}

export default function ChatListItem({ active, chat }: IChatListItemProps) {
	const { locale } = useRouter()
	const lastMessage = chat.messages?.at(-1)
	const sentAt = lastMessage?.sentAt ? new Date(lastMessage.sentAt) : null

	return (
		<div
			className="relative grid cursor-pointer grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-md border-none bg-neutral-300 text-start outline-none transition-colors is-[100%] plb-2 pli-2 after:absolute after:bg-neutral-400 after:bs-[2px] after:is-[100%] after:block-end-[-9px] hover:bg-neutral-400 focus-visible:bg-neutral-400 focus-visible:outline-2 focus-visible:outline-neutral-400 active:bg-neutral-500 data-[selected=true]:bg-neutral-500 dark:bg-neutral-800 dark:hover:bg-neutral-500 dark:focus-visible:bg-neutral-700 dark:active:bg-neutral-600 dark:data-[selected=true]:bg-neutral-700"
			data-selected={active}
			id={chat.id}
			tabIndex={-1}
		>
			<Image
				src={chat.thumbnailUrl}
				alt=""
				width={48}
				height={48}
				className="place-self-center rounded-full [grid-row:_1_/_span_3]"
			/>
			<p className="overflow-hidden text-ellipsis font-bold text-neutral-800 dark:text-neutral-100">
				{chat.name}
			</p>
			<p className="overflow-hidden text-ellipsis whitespace-nowrap text-base text-neutral-700 dark:text-neutral-300">
				{lastMessage?.text}
			</p>
			{sentAt && (
				<time
					dateTime={sentAt.toISOString()}
					className="text-end text-xs text-neutral-700 dark:text-neutral-300"
				>
					{formatLastMessageTime(sentAt, locale)}
				</time>
			)}
		</div>
	)
}
