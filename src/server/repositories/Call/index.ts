import { prisma } from '../../../server/db'
import type ICallRepository from './ICall'
import PrismaCallRepository from './PrismaCall'

const callRepository: ICallRepository = new PrismaCallRepository(prisma)

export default callRepository
export type { ICallRepository }
