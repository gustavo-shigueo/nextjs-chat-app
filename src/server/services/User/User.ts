import type { IUserRepository } from '../../../server/repositories/User'
import type { UserSchema } from '../../../server/api/schemas/userSchema'
import type { IUuidSerializer } from '../../../server/serializers/Uuid'
import type { IUserService } from '.'

export default class UserService implements IUserService {
	#userRepository: IUserRepository
	#uuidSerializer: IUuidSerializer

	public constructor(
		userRepository: IUserRepository,
		uuidService: IUuidSerializer
	) {
		this.#userRepository = userRepository
		this.#uuidSerializer = uuidService
	}

	public async findById(id: string): Promise<UserSchema> {
		const buffer = this.#uuidSerializer.toBuffer(id)

		const user = await this.#userRepository.findById(buffer)
		return this.#uuidSerializer.deepStringify(user)
	}

	public async findByName(name: string): Promise<UserSchema[]> {
		const user = await this.#userRepository.findByName(name)
		return this.#uuidSerializer.deepStringify(user)
	}

	public async findByEmail(email: string): Promise<UserSchema> {
		const user = await this.#userRepository.findByEmail(email)
		return this.#uuidSerializer.deepStringify(user)
	}

	public async findContacts(id: string): Promise<UserSchema[]> {
		const buffer = this.#uuidSerializer.toBuffer(id)

		const contacts = await this.#userRepository.findContacts(buffer)
		return this.#uuidSerializer.deepStringify(contacts)
	}

	public async addContact(id: string, contactId: string): Promise<void> {
		await this.#userRepository.addContact(
			this.#uuidSerializer.toBuffer(id),
			this.#uuidSerializer.toBuffer(contactId)
		)
	}

	public async removeContact(id: string, contactId: string): Promise<void> {
		await this.#userRepository.removeContact(
			this.#uuidSerializer.toBuffer(id),
			this.#uuidSerializer.toBuffer(contactId)
		)
	}

	public async searchNewContact(
		id: string,
		search: string,
		limit: number,
		cursor?: Date
	): Promise<UserSchema[]> {
		const users = await this.#userRepository.searchNewContact(
			this.#uuidSerializer.toBuffer(id),
			search,
			limit,
			cursor
		)

		return this.#uuidSerializer.deepStringify(users)
	}
}
