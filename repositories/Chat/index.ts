import client from 'prisma/client'
import PrismaChatRepository from './PrismaChatRepository'

const ChatRepository = new PrismaChatRepository(client)

export default ChatRepository
