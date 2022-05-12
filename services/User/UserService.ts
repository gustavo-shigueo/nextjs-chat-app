import User from 'entities/User'
import EmailAlreadyInUseError from 'errors/EmailAlreadyInUseError'
import InvalidFieldError from 'errors/InvalidFieldError'
import ICreateUserRequest from 'interfaces/ICreateUserRequest'
import IGoogleProfile from 'interfaces/IGoogleProfile'
import IUserRepository from 'repositories/User/IUserRepository'
import IUserService from './IUserService'
import emailRegex from 'utils/emailRegex'
import EmptyFields from 'validations/EmptyFields'
import FieldLength from 'validations/FieldLength'
import { randomUUID } from 'crypto'

export default class UserService implements IUserService {
	#userRepository: IUserRepository

	constructor(userRepository: IUserRepository) {
		this.#userRepository = userRepository
	}

	async create(userData: ICreateUserRequest): Promise<User> {
		const { name, googleProfile = null, email = '', password = '' } = userData
		FieldLength({ name }, 3, 50)

		EmptyFields(googleProfile ?? { email, password })

		if (!googleProfile) {
			this.#validateEmail(email)
			FieldLength({ password }, 8, 32)

			if (await this.#userRepository.isEmailInUse(email)) {
				throw new EmailAlreadyInUseError()
			}
		}

		const dicebearUrl = 'https://avatars.dicebear.com/api/bottts'
		const user = new User(
			name,
			email,
			password,
			googleProfile?.picture ?? `${dicebearUrl}/${name}-${randomUUID()}.svg`,
			!!googleProfile
		)
		return await this.#userRepository.save(user)
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

	associateGoogleProfile(user: User): Promise<User> {
		return this.#userRepository.associateGoogleProfile(user)
	}

	setOnlineStatus(userId: string, status: boolean): Promise<User> {
		return this.#userRepository.setOnlineStatus(userId, status)
	}

	#validateEmail(email: string): void {
		if (emailRegex.test(email)) return

		throw new InvalidFieldError('Invalid e-mail', 'email')
	}
}
