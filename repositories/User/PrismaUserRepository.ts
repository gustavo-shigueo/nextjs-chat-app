import User from 'entities/User'
import IUsersRepository from './IUserRepository'
import { PrismaClient } from '@prisma/client'
import NotFoundError from 'errors/NotFoundError'
import userSerializer from 'middlewares/serializers/userSerializer'
import client from 'utils/db/prisma/client'

class PrismaUserReopsitory implements IUsersRepository {
	#client: PrismaClient

	constructor(client: PrismaClient) {
		this.#client = client
	}

	async save(user: User): Promise<User> {
		const { id, contacts, messagesReceived, messagesSent, ...data } = user
		return userSerializer(await this.#client.user.create({ data }))
	}

	async isEmailInUse(email: string): Promise<boolean> {
		const count = await this.#client.user.count({ where: { email } })
		return count > 0
	}

	async findById(id: string): Promise<User> {
		const user = await this.#client.user.findUnique({ where: { id } })
		if (!user) throw new NotFoundError('User')

		return userSerializer(user)
	}

	async findByName(name: string): Promise<User[]> {
		const users = await this.#client.user.findMany({
			where: { name: { contains: name } },
		})

		return users.map(userSerializer)
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await this.#client.user.findUnique({ where: { email } })

		if (!user) return null

		return userSerializer(user)
	}

	async findByGoogleAssociatedEmail(email: string): Promise<User | null> {
		const user = await this.#client.user.findFirst({
			where: {
				AND: [{ email }, { googleAssociated: true }],
			},
		})

		if (!user) return null

		return userSerializer(user)
	}

	async listAll(): Promise<User[]> {
		const users = await this.#client.user.findMany()
		return users.map(userSerializer)
	}

	async associateGoogleProfile(user: User): Promise<User> {
		const u = await this.#client.user.update({
			where: { id: user.id },
			data: { googleAssociated: true },
		})

		if (!u) throw new NotFoundError('User')

		return userSerializer(u)
	}

	async setOnlineStatus(userId: string, status: boolean): Promise<User> {
		const user = await this.#client.user.update({
			where: { id: userId },
			data: { onlineStatus: status },
		})

		if (!user) throw new NotFoundError('User')

		return userSerializer(user)
	}
}

export default new PrismaUserReopsitory(client)
