import User from 'entities/User'
import InvalidCredentialsError from 'errors/InvalidCredentialsError'
import InvalidSignInMethodError from 'errors/InvalidSignInMethodError'
import NotFoundError from 'errors/NotFoundError'
import IAuthController from './IAuthController'
import ICreateUserRequest from 'interfaces/ICreateUserRequest'
import IGoogleProfile from 'interfaces/IGoogleProfile'
import IPasswordProvider from 'providers/password/IPasswordProvider'
import IUserController from 'controllers/User/IUserController'
import PasswordProvider from 'providers/password'
import EmptyFields from 'validations/EmptyFields'
import UserController from 'controllers/User'

class AuthController implements IAuthController {
	#userController: IUserController
	#passwordProvider: IPasswordProvider

	constructor(
		userController: IUserController,
		passwordProvider: IPasswordProvider
	) {
		this.#userController = userController
		this.#passwordProvider = passwordProvider
	}

	async signUp(user: ICreateUserRequest): Promise<User> {
		return await this.#userController.create(user)
	}

	async signInWithEmailAndPassword(
		email: string,
		password: string
	): Promise<User> {
		EmptyFields({ email, password })

		const user = await this.#userController.findByEmail(email)

		if (!user) throw new NotFoundError('User')
		if (!user.password) throw new InvalidSignInMethodError()

		const valid = await this.#passwordProvider.verify(password, user.password)
		if (!valid) throw new InvalidCredentialsError()

		return await this.#userController.setOnlineStatus(user._id!, true)
	}

	async signInWithGoogle(profile: IGoogleProfile): Promise<User> {
		const { googleId, name, email, imageUrl } = profile
		EmptyFields({ googleId, name, email, imageUrl })

		const account = await this.#userController.findByGoogleProfile(profile)

		if (account) {
			const a = await this.#userController.setOnlineStatus(account._id!, true)

			return account.googleId
				? a
				: this.#userController.associateGoogleProfile(a, profile)
		}

		const userData: ICreateUserRequest = {
			name,
			email,
			googleProfile: profile,
		}

		return this.#userController.create(userData)
	}

	async signOut(id: string): Promise<void> {
		await this.#userController.setOnlineStatus(id, false)
	}
}

export default new AuthController(UserController, PasswordProvider)
