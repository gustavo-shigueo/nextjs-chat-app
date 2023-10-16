import { ChatType, type PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import { env } from '../../../env.js'
import type IChatRepository from './IChat'
import type { JoinedChat } from '../schema'

export default class PrismaChatRepository implements IChatRepository {
	#prismaClient: PrismaClient

	public constructor(client: PrismaClient) {
		this.#prismaClient = client
	}

	public createPrivateChat(
		creator: Buffer,
		contact: Buffer
	): Promise<JoinedChat> {
		return this.#prismaClient.chat.create({
			data: {
				chatType: ChatType.PrivateChat,
				creatorId: creator,
				users: {
					connect: [{ id: creator }, { id: contact }],
				},
			},
			include: { users: true, messages: true, creator: true },
		})
	}

	public createGroupChat(
		name: string,
		creator: Buffer,
		users: readonly Buffer[]
	): Promise<JoinedChat> {
		const imageUrl = new URL(
			`${env.NEXT_PUBLIC_DICEBEAR_URL}?seed=${name}-${randomUUID()}`
		)

		return this.#prismaClient.chat.create({
			data: {
				name,
				chatType: ChatType.GroupChat,
				thumbnailUrl: imageUrl.toString(),
				creatorId: creator,
				users: {
					connect: [{ id: creator }, ...users.map(id => ({ id }))],
				},
			},
			include: { users: true, messages: true, creator: true },
		})
	}

	public findById(id: Buffer): Promise<JoinedChat> {
		return this.#prismaClient.chat.findUniqueOrThrow({
			where: { id },
			include: {
				users: true,
				creator: true,
				messages: {
					orderBy: { sentAt: 'desc' },
					take: 1,
				},
			},
		})
	}

	public findByParticipantId(userId: Buffer): Promise<JoinedChat[]> {
		return this.#prismaClient.chat.findMany({
			where: { users: { some: { id: userId } } },
			include: {
				users: true,
				creator: true,
				messages: {
					orderBy: { sentAt: 'desc' },
					take: 1,
				},
			},
		})
	}

	public addUser(id: Buffer, userId: Buffer): Promise<JoinedChat> {
		return this.#prismaClient.chat.update({
			where: { id },
			data: { users: { connect: { id: userId } } },
			include: { creator: true, messages: true, users: true },
		})
	}
}
