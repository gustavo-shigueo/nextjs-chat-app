import { type PrismaClient } from '@prisma/client'
import { type ICallRepository } from '.'
import { type Call } from '../schema'

export default class PrismaCallRepository implements ICallRepository {
	#prismaClient: PrismaClient

	public constructor(prismaClient: PrismaClient) {
		this.#prismaClient = prismaClient
	}

	public create(
		callerId: Buffer,
		chatId: Buffer,
		callType: 'Audio' | 'Video'
	): Promise<Call> {
		return this.#prismaClient.call.create({
			data: {
				chatId,
				callerId,
				callType,
				participants: {
					create: { participantId: callerId },
				},
			},
			include: { participants: { where: { leftAt: null } } },
		})
	}

	public end(callId: Buffer): Promise<Call> {
		return this.#prismaClient.call.update({
			where: { id: callId },
			data: {
				endedAt: new Date(),
				participants: {
					updateMany: {
						data: { leftAt: new Date() },
						where: { leftAt: null, callId },
					},
				},
			},
		})
	}

	public userJoin(callId: Buffer, userId: Buffer): Promise<Call> {
		return this.#prismaClient.call.update({
			where: { id: callId },
			data: {
				participants: {
					create: { participantId: userId },
				},
			},
			include: { participants: { where: { leftAt: null } } },
		})
	}

	public async userLeave(callId: Buffer, userId: Buffer): Promise<Call> {
		await this.#prismaClient.callParticipant.update({
			where: {
				callId_participantId: {
					callId,
					participantId: userId,
				},
			},
			data: {
				leftAt: new Date(),
			},
		})

		return this.#prismaClient.call.findUniqueOrThrow({
			where: { id: callId },
			include: { participants: { where: { leftAt: null } } },
		})
	}
}
