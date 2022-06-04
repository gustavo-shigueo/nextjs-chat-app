import User from 'entities/User'
import EmailAlreadyInUseError from 'errors/EmailAlreadyInUseError'
import InvalidFieldError from 'errors/InvalidFieldError'
import ICreateUserRequest from 'interfaces/ICreateUserRequest'
import IUserRepository from 'repositories/User/IUserRepository'
import IUserService from './IUserService'
import emailRegex from 'utils/emailRegex'
import EmptyFields from 'validations/EmptyFields'
import FieldLength from 'validations/FieldLength'
import { randomUUID } from 'crypto'
import IPasswordProvider from 'providers/password/IPasswordProvider'

export default class UserService implements IUserService {
	#userRepository: IUserRepository
	#passwordProvider: IPasswordProvider

	constructor(
		userRepository: IUserRepository,
		passwordProvider: IPasswordProvider
	) {
		this.#userRepository = userRepository
		this.#passwordProvider = passwordProvider
	}

	async create(userData: ICreateUserRequest): Promise<User> {
		let { name, googleProfile = null, email = '', password = '' } = userData
		FieldLength({ name }, 3, 50)

		EmptyFields(googleProfile ?? { email, password })

		if (!googleProfile) {
			this.#validateEmail(email)
			FieldLength({ password }, 8, 32)

			if (await this.#userRepository.isEmailInUse(email)) {
				throw new EmailAlreadyInUseError()
			}
		}

		if (password) password = await this.#passwordProvider.hash(password)

		const dicebearUrl = 'https://avatars.dicebear.com/api/bottts'
		const user = new User(
			name,
			email,
			password,
			googleProfile?.picture ?? `${dicebearUrl}/${name}-${randomUUID()}.svg`,
			!!googleProfile
		)

		return this.#userRepository.create(user)
	}

	findById(id: string): Promise<User> {
		return this.#userRepository.findById(id)
	}

	findByName(name: string): Promise<User[]> {
		return this.#userRepository.findByName(name)
	}

	findByEmail(email: string): Promise<User | null> {
		return this.#userRepository.findByEmail(email)
	}

	findByGoogleAssociatedEmail(email: string): Promise<User | null> {
		return this.#userRepository.findByGoogleAssociatedEmail(email)
	}

	listAll(): Promise<User[]> {
		return this.#userRepository.listAll()
	}

	associateGoogleProfile(userId: string): Promise<User> {
		return this.#userRepository.updateOne(
			{ googleAssociated: true },
			{ id: userId }
		)
	}

	async addToContacts(userId: string, newContactId: string): Promise<User> {
		return this.#userRepository.addToContacts(userId, newContactId)
	}

	setOnlineStatus(userId: string, status: boolean): Promise<User> {
		return this.#userRepository.updateOne(
			{ onlineStatus: status },
			{ id: userId }
		)
	}

	#validateEmail(email: string): void {
		if (emailRegex.test(email)) return

		throw new InvalidFieldError('Invalid e-mail', ['email'])
	}
}
