import client from 'prisma/client'
import PrismaMessageRepository from './PrismaMessageRepository'

const MessageRepository = new PrismaMessageRepository(client)

export default MessageRepository
