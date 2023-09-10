import { type ICallRepository } from '../../../server/repositories/Call'
import { type IUuidSerializer } from '../../../server/serializers/Uuid'
import { type ICallService } from '.'
import { type CallSchema } from '../../../server/api/schemas/callSchema'

export default class CallService implements ICallService {
	#callRepository: ICallRepository
	#uuidSerializer: IUuidSerializer

	public constructor(
		callRepository: ICallRepository,
		uuidSerializer: IUuidSerializer
	) {
		this.#callRepository = callRepository
		this.#uuidSerializer = uuidSerializer
	}

	public async create(
		callerId: string,
		chatId: string,
		callType: 'Audio' | 'Video'
	): Promise<CallSchema> {
		const call = await this.#callRepository.create(
			this.#uuidSerializer.toBuffer(callerId),
			this.#uuidSerializer.toBuffer(chatId),
			callType
		)

		return this.#uuidSerializer.deepStringify(call)
	}

	public async end(callId: string): Promise<CallSchema> {
		const call = await this.#callRepository.end(
			this.#uuidSerializer.toBuffer(callId)
		)

		return this.#uuidSerializer.deepStringify(call)
	}

	public async userJoin(callId: string, userId: string): Promise<CallSchema> {
		const call = await this.#callRepository.userJoin(
			this.#uuidSerializer.toBuffer(callId),
			this.#uuidSerializer.toBuffer(userId)
		)

		return this.#uuidSerializer.deepStringify(call)
	}

	public async userLeave(callId: string, userId: string): Promise<CallSchema> {
		const call = await this.#callRepository.userLeave(
			this.#uuidSerializer.toBuffer(callId),
			this.#uuidSerializer.toBuffer(userId)
		)

		return this.#uuidSerializer.deepStringify(call)
	}
}
