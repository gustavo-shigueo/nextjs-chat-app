import User from 'entities/User'
import EmailAlreadyInUseError from 'errors/EmailAlreadyInUseError'
import InvalidFieldError from 'errors/InvalidFieldError'
import IUserRepository from 'repositories/User/IUserRepository'
import IUserService from './IUserService'
import emailRegex from 'utils/emailRegex'
import FieldLength from 'validations/FieldLength'
import IPasswordProvider from 'providers/password/IPasswordProvider'
import GoogleAuthError from 'errors/GoogleAuthError'

export default class UserService implements IUserService {
	#userRepository: IUserRepository
	#passwordProvider: IPasswordProvider

	public constructor(
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

	public async findById(id: string): Promise<User> {
		return this.#userRepository.findById(id)
	}

	public async findByName(name: string): Promise<User[]> {
		return this.#userRepository.findByName(name)
	}

	public async findByEmail(email: string): Promise<User | null> {
		return this.#userRepository.findByEmail(email)
	}

	public async findByGoogleId(googleId: string): Promise<User | null> {
		return this.#userRepository.findByGoogleId(googleId)
	}

	public async listAll(): Promise<User[]> {
		return this.#userRepository.listAll()
	}

	public async associateGoogleProfile(
		userId: string,
		googleId: string
	): Promise<User> {
		return this.#userRepository.updateOne({ googleId }, { id: userId })
	}

	public async setOnlineStatus(userId: string, status: boolean): Promise<User> {
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
