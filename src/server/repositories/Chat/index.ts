import { prisma } from '../../../server/db'
import type IChatRepository from './IChat'
import PrismaChatRepository from './PrismaChat'

const chatRepository: IChatRepository = new PrismaChatRepository(prisma)

export default chatRepository
export type { IChatRepository }
