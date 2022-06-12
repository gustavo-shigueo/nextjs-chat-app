import User from 'entities/User'
import GoogleAuthError from 'errors/GoogleAuthError'
import InvalidCredentialsError from 'errors/InvalidCredentialsError'
import InvalidSignInMethodError from 'errors/InvalidSignInMethodError'
import ICreateUserRequest from 'interfaces/ICreateUserRequest'
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

		if (!user) throw new InvalidCredentialsError()
		if (!user.password) throw new InvalidSignInMethodError()

		const valid = await this.#passwordProvider.verify(password, user.password)
		if (!valid) throw new InvalidCredentialsError()

		return this.#userService.setOnlineStatus(user.id!, true)
	}

	async signInWithGoogle(accessToken: string): Promise<User> {
		const url = 'https://www.googleapis.com/oauth2/v3/userinfo'

		const verificationResponse = await fetch(url, {
			// method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})

		if (verificationResponse.status !== 200) throw new GoogleAuthError()

		const verificationData = await verificationResponse.json()

		const { name, email, picture } = verificationData
		EmptyFields({ name, email, picture })

		let account = await this.#userService.findByGoogleAssociatedEmail(email)

		if (account) {
			account = await this.#userService.setOnlineStatus(account.id!, true)

			return account.googleAssociated
				? account
				: this.#userService.associateGoogleProfile(account.id!)
		}

		const userData: ICreateUserRequest = {
			name,
			email,
			googleProfile: { name, email, picture },
		}

		return this.#userService.create(userData)
	}

	async signOut(id: string): Promise<void> {
		await this.#userService.setOnlineStatus(id, false)
	}
}
