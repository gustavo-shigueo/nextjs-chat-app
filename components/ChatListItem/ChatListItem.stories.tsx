/* eslint-disable */
import ChatListItem from './ChatListItem'

export default {
	title: 'ChatListItem',
}

export const Default = () => (
	<ChatListItem
		active={false}
		chat={{} as any}
		key={1}
		setSelectedChatId={(() => {}) as any}
	/>
)

Default.story = {
	name: 'default',
}
