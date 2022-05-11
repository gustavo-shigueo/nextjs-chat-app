import User from 'entities/User'
import ICreateUserRequest from 'interfaces/ICreateUserRequest'
import IGoogleProfile from 'interfaces/IGoogleProfile'
import IAuthService from 'services/Auth/IAuthService'
import IAuthController from './IAuthController'

export default class AuthController implements IAuthController {
	#authService: IAuthService

	constructor(authService: IAuthService) {
		this.#authService = authService
	}

	signUp(userData: ICreateUserRequest): Promise<User> {
		return this.#authService.signUp(userData)
	}

	signInWithEmailAndPassword(email: string, password: string): Promise<User> {
		return this.#authService.signInWithEmailAndPassword(email, password)
	}

	signInWithGoogle(
		accessToken: string,
		googleProfile: IGoogleProfile
	): Promise<User> {
		return this.#authService.signInWithGoogle(accessToken, googleProfile)
	}
}
