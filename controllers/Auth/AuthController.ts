import User from 'entities/User'
import ICreateUserRequest from 'interfaces/ICreateUserRequest'
import IAuthService from 'services/Auth/IAuthService'
import IAuthController from './IAuthController'

export default class AuthController implements IAuthController {
	#authService: IAuthService

	constructor(authService: IAuthService) {
		this.#authService = authService
	}

	public async signUpWithGoogle(accessToken: string): Promise<User> {
		return this.#authService.signUpWithGoogle(accessToken)
	}

	public async signUpWithEmailAndPassword(
		userData: ICreateUserRequest
	): Promise<User> {
		return this.#authService.signUpWithEmailAndPassword(userData)
	}

	public async signInWithEmailAndPassword(
		email: string,
		password: string
	): Promise<User> {
		return this.#authService.signInWithEmailAndPassword(email, password)
	}

	public async signInWithGoogle(accessToken: string): Promise<User> {
		return this.#authService.signInWithGoogle(accessToken)
	}
}
