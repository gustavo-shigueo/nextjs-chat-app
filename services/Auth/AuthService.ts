import User from 'entities/User'
import InvalidCredentialsError from 'errors/InvalidCredentialsError'
import InvalidSignInMethodError from 'errors/InvalidSignInMethodError'
import NotFoundError from 'errors/NotFoundError'
import ICreateUserRequest from 'interfaces/ICreateUserRequest'
import IGoogleProfile from 'interfaces/IGoogleProfile'
import IPasswordProvider from 'providers/password/IPasswordProvider'
import IUserService from 'services/User/IUserService'
import EmptyFields from 'validations/EmptyFields'
import IAuthService from './IAuthService'

export default class AuthService implements IAuthService {
	#userService: IUserService
	#passwordProvider: IPasswordProvider

	constructor(userService: IUserService, passwordProvider: IPasswordProvider) {
		this.#userService = userService
		this.#passwordProvider = passwordProvider
	}

	async signUp(user: ICreateUserRequest): Promise<User> {
		return this.#userService.create(user)
	}

	async signInWithEmailAndPassword(
		email: string,
		password: string
	): Promise<User> {
		EmptyFields({ email, password })

		const user = await this.#userService.findByEmail(email)

		if (!user) throw new NotFoundError('User')
		if (!user.password) throw new InvalidSignInMethodError()

		const valid = await this.#passwordProvider.verify(password, user.password)
		if (!valid) throw new InvalidCredentialsError()

		return this.#userService.setOnlineStatus(user._id!, true)
	}

	async signInWithGoogle(
		accessToken: string,
		profile: IGoogleProfile
	): Promise<User> {
		const verifyTokenURL =
			'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='

		const verificationResponse = await fetch(
			`${verifyTokenURL}${accessToken}`,
			{ method: 'POST' }
		)

		const { googleId, name, email, imageUrl } = profile
		EmptyFields({ googleId, name, email, imageUrl })

		const verificationData = await verificationResponse.json()

		if (
			verificationData.issued_to !==
				process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ||
			verificationData.user_id !== googleId
		) {
			throw new InvalidCredentialsError()
		}

		const account = await this.#userService.findByGoogleProfile(profile)

		if (account) {
			const a = await this.#userService.setOnlineStatus(account._id!, true)

			return account.googleId
				? a
				: this.#userService.associateGoogleProfile(a, profile)
		}

		const userData: ICreateUserRequest = {
			name,
			email,
			googleProfile: profile,
		}

		return this.#userService.create(userData)
	}

	async signOut(id: string): Promise<void> {
		await this.#userService.setOnlineStatus(id, false)
	}
}
