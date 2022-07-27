import User from 'entities/User'
import IUsersRepository from './IUserRepository'
import { PrismaClient } from '@prisma/client'
import NotFoundError from 'errors/NotFoundError'
import userMapper from 'entityMappers/userMapper'
import { randomUUID } from 'crypto'

export default class PrismaUserReopsitory implements IUsersRepository {
	#client: PrismaClient

	public constructor(client: PrismaClient) {
		this.#client = client
	}

	async #ensureUniqueId(user: User) {
		while (await this.findById(user.id).catch(() => null)) {
			user.id = randomUUID()
		}
	}

	public async create(user: User): Promise<User> {
		await this.#ensureUniqueId(user)

		return userMapper(await this.#client.user.create({ data: user }))
	}

	public async isEmailInUse(email: string): Promise<boolean> {
		const count = await this.#client.user.count({ where: { email } })
		return count > 0
	}

	public async findById(id: string): Promise<User> {
		const user = await this.#client.user.findUnique({ where: { id } })
		if (!user) throw new NotFoundError('User')

		return userMapper(user)
	}

	public async findByName(name: string): Promise<User[]> {
		const users = await this.#client.user.findMany({
			where: { name: { contains: name } },
		})

		return users.map(userMapper)
	}

	public async findByEmail(email: string): Promise<User | null> {
		const user = await this.#client.user.findUnique({ where: { email } })

		if (!user) return null

		return userMapper(user)
	}

	public async findByGoogleId(googleId: string): Promise<User | null> {
		const user = await this.#client.user.findFirst({
			where: { googleId },
		})

		if (!user) return null

		return userMapper(user)
	}

	public async listAll(): Promise<User[]> {
		const users = await this.#client.user.findMany()
		return users.map(userMapper)
	}

	public async updateOne(
		data: Partial<Omit<User, 'id'>>,
		where: Partial<Pick<User, 'id' | 'email' | 'googleId'>>
	): Promise<User> {
		const { googleId, ...whereData } = where

		const user = await this.#client.user
			.update({
				data,
				where: {
					...whereData,
					googleId: googleId ?? undefined,
				},
			})
			.catch(() => null)

		if (!user) throw new NotFoundError('User')

		return userMapper(user)
	}
}
