import type { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import { env } from '../../../env.js'
import type { IUserRepository } from '.'
import type { User } from '../schema'

export default class PrismaUserRepository implements IUserRepository {
	#prismaClient: PrismaClient

	public constructor(prismaClient: PrismaClient) {
		this.#prismaClient = prismaClient
	}

	public findById(id: Buffer): Promise<User> {
		return this.#prismaClient.user.findUniqueOrThrow({ where: { id } })
	}

	public findByName(name: string): Promise<User[]> {
		return this.#prismaClient.user.findMany({
			where: { name, NOT: { emailVerified: null } },
		})
	}

	public findByEmail(email: string): Promise<User> {
		return this.#prismaClient.user.findUniqueOrThrow({ where: { email } })
	}

	public findContacts(id: Buffer): Promise<User[]> {
		return this.#prismaClient.user.findMany({
			where: { contactedBy: { some: { id } } },
		})
	}

	public create(
		name: string,
		email: string,
		passwordHash: string
	): Promise<User> {
		const imageUrl = new URL(
			`${env.NEXT_PUBLIC_DICEBEAR_URL}/${name}-${randomUUID()}.svg`
		)

		return this.#prismaClient.user.create({
			data: {
				name,
				email,
				image: imageUrl.toString(),
				passwordHash,
			},
		})
	}

	public async addContact(id: Buffer, contactId: Buffer): Promise<void> {
		await this.#prismaClient.user.update({
			where: { id },
			data: { contacts: { connect: { id: contactId } } },
		})
	}

	public async removeContact(id: Buffer, contactId: Buffer): Promise<void> {
		await this.#prismaClient.user.update({
			where: { id },
			data: { contacts: { disconnect: { id: contactId } } },
		})
	}

	public searchNewContact(
		id: Buffer,
		search: string,
		limit: number,
		cursor?: Date | undefined
	): Promise<User[]> {
		return this.#prismaClient.user.findMany({
			take: limit + 1,
			cursor: cursor ? { createdAt: cursor } : undefined,
			orderBy: { createdAt: 'desc' },
			where: {
				OR: [
					{ name: { startsWith: search } },
					{ email: { startsWith: search } },
				],
				NOT: { OR: [{ id }, { emailVerified: null }] },
				contactedBy: { none: { id } },
			},
		})
	}
}
