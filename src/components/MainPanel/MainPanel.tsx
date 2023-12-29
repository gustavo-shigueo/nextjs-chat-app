import { useChats } from '../../contexts/ChatContext'
import useEventListener from '../../hooks/useEventListener'
import useMediaQuery from '../../hooks/useMediaQuery'
import ChatsPanel from '../ChatsPanel'
import MessagesPanel from '../MessagesPanel'

export default function MainPanel() {
	const small = useMediaQuery('(width < 40em)')
	const { selectedChatId, setSelectedChatId } = useChats()

	useEventListener('keydown', e => {
		if (e.key === 'Escape') setSelectedChatId('')
	})

	return (
		<main
			className="relative grid grid-cols-[minmax(0,20em)_1fr] divide-neutral-600 overflow-hidden min-bs-0 data-[mobile=true]:grid-cols-[1fr] data-[mobile=true]:grid-rows-[1fr] data-[mobile=false]:divide-i-2"
			data-mobile={small}
			style={small && selectedChatId ? { gridRow: 'span 2' } : undefined}
		>
			<ChatsPanel />

			<MessagesPanel />
		</main>
	)
}
