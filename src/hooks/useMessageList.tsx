import { useSession } from 'next-auth/react'
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react'
import { useChats } from '../contexts/ChatContext'
import type { ChatSchema } from '../server/api/schemas/chatSchema'
import { api } from '../utils/api'

const useMessageList = (chat: ChatSchema, limit = 50) => {
	const wrapperRef = useRef<HTMLDivElement>(null)
	const spinnerRef = useRef<HTMLDivElement>(null)
	const [previousScrollHeight, setPreviousScrollHeight] = useState(0)

	const { unshiftMessages } = useChats()
	const { data: session } = useSession()

	const firstMessage = chat.messages[0]
	const lastMessage = chat.messages.at(-1)

	const { fetchNextPage, hasNextPage, isLoading } =
		api.messages.listByChat.useInfiniteQuery(
			{ chatId: chat.id, limit },
			{
				initialCursor: chat.messages[0]?.sentAt,
				getNextPageParam(lastPage) {
					return lastPage.length === limit + 1
						? lastPage.at(-1)?.sentAt
						: undefined
				},
			}
		)

	const updateMssageList = useCallback(async () => {
		if (!hasNextPage || isLoading) return

		const { data } = await fetchNextPage()
		const messages = data?.pages.at(-1)?.reverse() ?? []

		unshiftMessages(chat.id, messages)
	}, [chat.id, unshiftMessages, fetchNextPage, hasNextPage, isLoading])

	useLayoutEffect(() => {
		if (!wrapperRef.current) return

		setPreviousScrollHeight(wrapperRef.current.scrollHeight)

		// The message that was the last before the new
		// message was sent/received
		const prevLastMessage = wrapperRef.current.querySelector(
			'li:has(+ li:last-child)'
		)

		const rect = prevLastMessage?.getBoundingClientRect()
		const viewportHeight =
			window.innerHeight || document.documentElement.clientHeight

		const isLastMessageInView =
			rect && rect.top >= 0 && rect.bottom <= viewportHeight

		// Always scroll down if the user sent the message,
		// if the user received it, only scroll if what was
		// the last message is on the viewport
		if (lastMessage?.senderId !== session?.user.id && !isLastMessageInView) {
			return
		}

		wrapperRef.current.scrollTo({
			top: Number.MAX_SAFE_INTEGER,
			behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
				? 'instant'
				: 'smooth',
		})
	}, [lastMessage?.id, lastMessage?.senderId, session?.user.id])

	useEffect(() => {
		const target = spinnerRef.current

		if (!target) return

		const intersectionObserver = new IntersectionObserver(
			([entry]) => {
				if (!entry?.isIntersecting) return

				void updateMssageList()
			},
			{ threshold: 1 }
		)
		intersectionObserver.observe(target)

		return () => intersectionObserver.unobserve(target)
	}, [updateMssageList])

	useLayoutEffect(() => {
		const target = wrapperRef.current

		if (!target) return

		const delta = target.scrollHeight - previousScrollHeight

		setPreviousScrollHeight(target.scrollHeight)

		if (delta <= 0) return

		target.scrollTop += delta
	}, [firstMessage?.id, previousScrollHeight])

	useEffect(() => {
		if (chat.messages.length === 1) void updateMssageList()
	}, [updateMssageList, chat.messages.length])

	return { wrapperRef, spinnerRef, hasNextPage }
}

export default useMessageList
