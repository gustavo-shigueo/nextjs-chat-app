import { z } from 'zod'
import BadRequestError from '../../../server/errors/BadRequest'
import UnauthorizedError from '../../../server/errors/Unauthorized'
import type { IUserRepository } from '../../../server/repositories/User'
import type { IUuidSerializer } from '../../../server/serializers/Uuid'
import type { IAuthService } from '.'
import type { IPasswordService } from '../Password'
import type { UserSchema } from '../../../server/api/schemas/userSchema'
import type { Credentials } from './IAuth'

export default class AuthService implements IAuthService {
	#userRepository: IUserRepository
	#passwordService: IPasswordService
	#uuidSerializer: IUuidSerializer

	public constructor(
		userRepository: IUserRepository,
		passwordService: IPasswordService,
		uuidSerializer: IUuidSerializer
	) {
		this.#userRepository = userRepository
		this.#passwordService = passwordService
		this.#uuidSerializer = uuidSerializer
	}

	public async authenticate(
		credentials: Omit<Credentials, 'name'>
	): Promise<UserSchema> {
		const schema = z.object({
			name: z
				.string()
				.min(2, 'Name must contain at least 2 characters')
				.optional(),
			email: z.string({ required_error: 'Email must be provided' }).email(),
			password: z.string({ required_error: 'Password must be provided' }), // Further checked in PasswordService
		})

		schema.parse(credentials)
		const { passwordHash, ...user } = await this.#userRepository
			.findByEmail(credentials.email)
			.catch(() => {
				throw new UnauthorizedError('Invalid e-mail or password')
			})

		if (!passwordHash) {
			throw new UnauthorizedError('Invalid signin method')
		}

		const isPasswordValid = await this.#passwordService.verify(
			credentials.password,
			passwordHash
		)

		if (!isPasswordValid) {
			throw new UnauthorizedError('Invalid e-mail or password')
		}

		return this.#uuidSerializer.deepStringify(user)
	}

	public async signup({ name, email, password }: Required<Credentials>) {
		const existent = await this.#userRepository
			.findByEmail(email)
			.then(() => true)
			.catch(() => false)

		if (existent) {
			throw new BadRequestError('User already exists')
		}

		const hashedPassword = await this.#passwordService.hash(password)
		await this.#userRepository.create(name, email, hashedPassword)
	}
}
