import PrismaUserReopsitory from './PrismaUserRepository'
import client from 'prisma/client'

const UserRepository = new PrismaUserReopsitory(client)

export default UserRepository
