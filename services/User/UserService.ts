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
import GoogleAuthError from 'errors/GoogleAuthError'

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

	public async save(user: User): Promise<User> {
		if (user.password) {
			FieldLength({ password: user.password }, 8, 32)
			user.password = await this.#passwordProvider.hash(user.password)
		}

		this.#validateEmail(user.email)

		if (await this.#userRepository.isEmailInUse(user.email)) {
			throw new EmailAlreadyInUseError()
		}

		if (await this.#userRepository.findByGoogleId(user.googleId ?? '')) {
			throw new GoogleAuthError(
				'A user with this Google account already exists'
			)
		}

		FieldLength({ name: user.name }, 3, 50)

		return this.#userRepository.create(user)
	}

	async findById(id: string): Promise<User> {
		return this.#userRepository.findById(id)
	}

	async findByName(name: string): Promise<User[]> {
		return this.#userRepository.findByName(name)
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.#userRepository.findByEmail(email)
	}

	async findByGoogleId(googleId: string): Promise<User | null> {
		return this.#userRepository.findByGoogleId(googleId)
	}

	async listAll(): Promise<User[]> {
		return this.#userRepository.listAll()
	}

	async associateGoogleProfile(
		userId: string,
		googleId: string
	): Promise<User> {
		return this.#userRepository.updateOne({ googleId }, { id: userId })
	}

	async setOnlineStatus(userId: string, status: boolean): Promise<User> {
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
