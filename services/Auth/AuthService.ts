import User from 'entities/User'
import GoogleAuthError from 'errors/GoogleAuthError'
import InvalidCredentialsError from 'errors/InvalidCredentialsError'
import InvalidSignInMethodError from 'errors/InvalidSignInMethodError'
import ICreateUserRequest from 'interfaces/ICreateUserRequest'
import IPasswordProvider from 'providers/password/IPasswordProvider'
import IUserService from 'services/User/IUserService'
import EmptyFields from 'validations/EmptyFields'
import IAuthService from './IAuthService'

interface GoogleAuthResponse {
	email: string
	email_verified: boolean
	given_name: string
	locale: string
	name: string
	picture: string
	sub: string
}

export default class AuthService implements IAuthService {
	#userService: IUserService
	#passwordProvider: IPasswordProvider

	constructor(userService: IUserService, passwordProvider: IPasswordProvider) {
		this.#userService = userService
		this.#passwordProvider = passwordProvider
	}

	public async signUpWithEmailAndPassword(
		userData: ICreateUserRequest
	): Promise<User> {
		if (userData.method !== 'emailAndPassword') {
			throw new InvalidCredentialsError()
		}

		const { password, email, name } = userData
		if (!password) throw new InvalidCredentialsError('Password is required')
		return this.#userService.save(new User(name, email, password))
	}

	public async signUpWithGoogle(accessToken: string): Promise<User> {
		const { sub, name, email, picture } = await this.#validateGoogleAccessToken(
			accessToken
		)

		const user = new User(name, email, null, picture || undefined, sub)

		return this.#userService.save(user)
	}

	public async signInWithEmailAndPassword(
		email: string,
		password: string
	): Promise<User> {
		EmptyFields({ email, password })

		const user = await this.#userService.findByEmail(email)

		if (!user) throw new InvalidCredentialsError()
		if (!user.password) throw new InvalidSignInMethodError()

		const valid = await this.#passwordProvider.verify(password, user.password)
		if (!valid) throw new InvalidCredentialsError()

		return this.#userService.setOnlineStatus(user.id, true)
	}

	public async signInWithGoogle(accessToken: string): Promise<User> {
		const { sub } = await this.#validateGoogleAccessToken(accessToken)

		const user = await this.#userService.findByGoogleId(sub)

		if (!user) {
			throw new GoogleAuthError(
				'No user is associated with this Google account'
			)
		}

		return this.#userService.setOnlineStatus(user.id, true)
	}

	public async signOut(id: string): Promise<void> {
		await this.#userService.setOnlineStatus(id, false)
	}

	async #validateGoogleAccessToken(
		accessToken: string
	): Promise<Pick<GoogleAuthResponse, 'sub' | 'name' | 'email' | 'picture'>> {
		const url = 'https://www.googleapis.com/oauth2/v3/userinfo'

		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})

		if (response.status !== 200) throw new GoogleAuthError()

		const verificationData: GoogleAuthResponse = await response.json()

		const { sub, name, email, picture } = verificationData
		EmptyFields({ sub, name, email, picture })

		return { sub, name, email, picture }
	}
}
