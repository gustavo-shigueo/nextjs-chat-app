import { prisma } from '../../../server/db'
import type IMessageRepository from './IMessage'
import PrismaMessageRepository from './PrismaMessage'

const messageRepository: IMessageRepository = new PrismaMessageRepository(
	prisma
)

export default messageRepository
export type { IMessageRepository }
