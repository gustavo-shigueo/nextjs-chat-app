import User from 'entities/User'
import IUsersRepository from './IUserRepository'
import { PrismaClient } from '@prisma/client'
import NotFoundError from 'errors/NotFoundError'
import userMapper from 'entityMappers/userMapper'

export default class PrismaUserReopsitory implements IUsersRepository {
	#client: PrismaClient

	constructor(client: PrismaClient) {
		this.#client = client
	}

	async create(user: User): Promise<User> {
		const { id, ...data } = user
		return userMapper(await this.#client.user.create({ data }))
	}

	async isEmailInUse(email: string): Promise<boolean> {
		const count = await this.#client.user.count({ where: { email } })
		return count > 0
	}

	async findById(id: string): Promise<User> {
		const user = await this.#client.user.findUnique({ where: { id } })
		if (!user) throw new NotFoundError('User')

		return userMapper(user)
	}

	async findByName(name: string): Promise<User[]> {
		const users = await this.#client.user.findMany({
			where: { name: { contains: name } },
		})

		return users.map(userMapper)
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await this.#client.user.findUnique({ where: { email } })

		if (!user) return null

		return userMapper(user)
	}

	async findByGoogleAssociatedEmail(email: string): Promise<User | null> {
		const user = await this.#client.user.findFirst({
			where: {
				AND: [{ email }, { googleAssociated: true }],
			},
		})

		if (!user) return null

		return userMapper(user)
	}

	async listAll(): Promise<User[]> {
		const users = await this.#client.user.findMany()
		return users.map(userMapper)
	}

	async listUserContacts(id: string): Promise<User[]> {
		const result = await this.#client.user.findUnique({
			where: { id },
			include: { contacts: true },
		})

		if (!result) throw new NotFoundError('User')

		return result.contacts
	}

	async addToContacts(userId: string, newContactId: string): Promise<User> {
		const user = await this.#client.user
			.update({
				where: { id: userId },
				data: {
					contacts: {
						connect: { id: newContactId },
					},
				},
			})
			.catch(() => null)

		if (!user) throw new NotFoundError('User')

		return userMapper(user)
	}

	async updateOne(data: Partial<User>, where: Partial<User>): Promise<User> {
		const user = await this.#client.user
			.update({
				where,
				data,
			})
			.catch(() => null)

		if (!user) throw new NotFoundError('User')

		return userMapper(user)
	}
}
