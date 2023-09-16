import { z } from 'zod'
import BadRequestError from '../../../server/errors/BadRequest'
import UnauthorizedError from '../../../server/errors/Unauthorized'
import type { IUserRepository } from '../../../server/repositories/User'
import type { IUuidSerializer } from '../../../server/serializers/Uuid'
import type { IAuthService } from '.'
import type { IPasswordService } from '../Password'
import type { UserSchema } from '../../../server/api/schemas/userSchema'
import type { Credentials } from './IAuth'
import type { IEmailService } from '../Email'
import type { IJwtService } from '../Jwt'
import { env } from '../../../env'

export default class AuthService implements IAuthService {
	#userRepository: IUserRepository
	#emailService: IEmailService
	#passwordService: IPasswordService
	#uuidSerializer: IUuidSerializer
	#jwtService: IJwtService

	public constructor(
		userRepository: IUserRepository,
		emailService: IEmailService,
		passwordService: IPasswordService,
		jwtService: IJwtService,
		uuidSerializer: IUuidSerializer
	) {
		this.#userRepository = userRepository
		this.#emailService = emailService
		this.#passwordService = passwordService
		this.#jwtService = jwtService
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
				throw new UnauthorizedError('InvalidCredentials')
			})

		if (!passwordHash) {
			throw new UnauthorizedError('InvalidSigninMethod')
		}

		if (!user.emailVerified) {
			throw new UnauthorizedError('EmailNotVerified')
		}

		const isPasswordValid = await this.#passwordService.verify(
			credentials.password,
			passwordHash
		)

		if (!isPasswordValid) {
			throw new UnauthorizedError('InvalidCredentials')
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
		const user = await this.#userRepository.create(name, email, hashedPassword)

		const id = this.#uuidSerializer.stringify(user.id)

		const token = this.#jwtService.sign({ id })
		const url = new URL(`/confirm-email/${id}/${token}`, env.NEXTAUTH_URL)

		void this.#emailService.sendConfirmation(email, user.name, url.href)

		return this.#uuidSerializer.stringify(user.id)
	}

	public async requestConfirmationEmail(email: string) {
		const user = await this.#userRepository.findByEmail(email)

		const id = this.#uuidSerializer.stringify(user.id)

		const token = this.#jwtService.sign({ id })
		const url = new URL(`/confirm-email/${id}/${token}`, env.NEXTAUTH_URL)

		await this.#emailService.sendConfirmation(email, user.name, url.href)
	}

	public async requestPasswordReset(email: string) {
		try {
			const user = await this.#userRepository.findByEmail(email)

			const id = this.#uuidSerializer.stringify(user.id)

			const token = this.#jwtService.sign({ id })
			const url = new URL(`/reset-password/${id}/${token}`, env.NEXTAUTH_URL)

			void this.#emailService.sendPasswordReset(email, user.name, url.href)
		} catch {}
	}

	public async confirmEmail(id: string, token: string) {
		try {
			const payload = this.#jwtService.verify<{ id: string }>(token)

			if (payload.id !== id) {
				throw new Error()
			}

			await this.#userRepository.confirmEmail(this.#uuidSerializer.toBuffer(id))
		} catch {
			throw new BadRequestError('Invalid Token')
		}
	}

	public async resetPassword(id: string, token: string, password: string) {
		try {
			const payload = this.#jwtService.verify<{ id: string }>(token)

			if (payload.id !== id) {
				throw new Error()
			}

			const hashedPassword = await this.#passwordService.hash(password)

			await this.#userRepository.resetPassword(
				this.#uuidSerializer.toBuffer(id),
				hashedPassword
			)
		} catch {
			throw new BadRequestError('Invalid Token')
		}
	}
}
