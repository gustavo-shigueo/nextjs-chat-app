import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import type { MappedChat } from '../../../contexts/ChatContext/ChatContext'
import type { MessageSchema } from '../../../server/api/schemas/messageSchema'
import { getWeekDay } from '../../../utils/date/getWeekDay'
import { isToday } from '../../../utils/date/isToday'
import { isWithinWeek } from '../../../utils/date/isWithinWeek'
import { isYesterday } from '../../../utils/date/isYesterday'
import { formatDate, formatTime } from '../../../utils/formatters/dateTime'
import { formatRelativeDate } from '../../../utils/formatters/relativeDateTime'

type MessageListItemProps = {
	chat: MappedChat
	message: MessageSchema
	previousMessage: MessageSchema | undefined
	delay: number
}

function formatDateSeparator(date: Date, locale: string | undefined) {
	if (isToday(date) || isYesterday(date)) {
		return formatRelativeDate(
			date.getDate() - new Date().getDate(),
			'day',
			locale
		).replace(/^[a-z]/, c => c.toUpperCase())
	}

	if (isWithinWeek(date)) {
		return getWeekDay(date, locale).replace(/^[a-z]/, c => c.toUpperCase())
	}

	return formatDate(date, locale)
}

export default function MessageListItem({
	chat,
	message,
	previousMessage,
	delay,
}: MessageListItemProps) {
	const ref = useRef<HTMLDivElement>(null)
	const { locale } = useRouter()
	const { data: session } = useSession()

	const isSender = message.senderId === session?.user.id
	const isDifferentSender = message.senderId !== previousMessage?.senderId
	const isDifferentDate =
		message.sentAt.getDate() !== previousMessage?.sentAt.getDate() ||
		message.sentAt.getMonth() !== previousMessage?.sentAt.getMonth() ||
		message.sentAt.getFullYear() !== previousMessage?.sentAt.getFullYear()

	useEffect(() => {
		if (!ref.current) return

		ref.current.animate([{ opacity: 1, transform: 'translate(0)' }], {
			duration: 250,
			fill: 'forwards',
			delay: 100 * delay,
		})
	}, [delay])

	return (
		<>
			{isDifferentDate && (
				<span className="self-center rounded-full bg-gray-300 mlb-4 plb-0 pli-8 dark:bg-gray-600">
					{formatDateSeparator(message.sentAt, locale)}
				</span>
			)}
			<article
				id={message.id}
				ref={ref}
				data-sender={isSender}
				data-chevron={isDifferentSender || isDifferentDate}
				className="relative grid gap-1 break-all rounded opacity-0 shadow-md is-max min-is-[10ch] max-is-[min(65%,_75ch)] plb-1 pli-2 [line-height:_1] after:absolute after:border-4 after:block-start-0 after:border-be-transparent data-[sender='true']:self-end data-[sender='false']:data-[chevron='true']:rounded-ss-none data-[sender='true']:data-[chevron='true']:rounded-se-none data-[sender='false']:bg-neutral-300 data-[sender='true']:bg-purple-800 data-[sender='true']:text-neutral-50 data-[chevron='false']:after:hidden data-[sender='false']:after:-translate-x-full data-[sender='true']:after:translate-x-full data-[sender='true']:after:border-purple-800 data-[sender='false']:after:inline-start-0 data-[sender='true']:after:inline-end-0 data-[sender='false']:after:border-be-transparent data-[sender='false']:after:border-is-transparent data-[sender='true']:after:border-be-transparent data-[sender='true']:after:border-ie-transparent data-[sender='false']:motion-safe:-translate-x-full data-[sender='true']:motion-safe:translate-x-full data-[sender='false']:dark:bg-neutral-700 data-[sender='false']:dark:text-neutral-50 data-[sender='false']:dark:after:border-bs-neutral-700 data-[sender='false']:dark:after:border-ie-neutral-700"
			>
				{chat.chatType === 'GroupChat' &&
					!isSender &&
					(isDifferentSender || isDifferentDate) && (
						<span
							data-author
							className="text-xs font-bold [--default-color:_var(--color-neutral-800)] [color:_var(--user-color)] supports-[color:_color-mix(in_srgb,_black,_white)]:[color:_color-mix(in_srgb,_75%_var(--user-color),_var(--default-color))] dark:[--default-color:_var(--color-neutral-50)]"
							style={{
								'--user-color': `#${message.senderId.substring(0, 6)}`,
							}}
						>
							{chat.users.find(u => u.id === message.senderId)?.name}
						</span>
					)}
				<blockquote>
					<pre className="font-[inherit]">{message.text}</pre>
				</blockquote>
				<time
					dateTime={message.sentAt.toISOString()}
					className="block text-end font-light [line-height:_1] [font-size:_0.65rem]"
				>
					{formatTime(message.sentAt, locale)}
				</time>
			</article>
		</>
	)
}
