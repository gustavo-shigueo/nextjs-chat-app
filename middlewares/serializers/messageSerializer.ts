import Message from 'entities/Message'

const messageSerializer = <T extends Message>({
	id,
	chatId,
	senderId,
	text,
	sentAt,
}: T): Message => {
	return { id, chatId, senderId, text, sentAt }
}

export default messageSerializer
