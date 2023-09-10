import { prisma } from '../../../server/db'
import type IUserRepository from './IUser'
import PrismaUserRepository from './PrismaUser'

const userRepository: IUserRepository = new PrismaUserRepository(prisma)

export default userRepository
export type { IUserRepository }
