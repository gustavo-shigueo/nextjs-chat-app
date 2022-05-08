import User from 'entities/User'
import ICreateUserRequest from 'interfaces/ICreateUserRequest'
import IGoogleProfile from 'interfaces/IGoogleProfile'
import IUserController from 'interfaces/IUserController'
import IUserService from 'interfaces/IUserService'
import UserService from 'services/User'
class UserController implements IUserController {
	#userService: IUserService

	constructor(userService: IUserService) {
		this.#userService = userService
	}

	async create(userData: ICreateUserRequest): Promise<User> {
		return this.#userService.create(userData)
	}

	async findById(id: string): Promise<User> {
		return this.#userService.findById(id)
	}

	async findByName(name: string) {
		return this.#userService.findByName(name)
	}

	async findByEmail(email: string) {
		return this.#userService.findByEmail(email)
	}

	async findByGoogleProfile(profile: IGoogleProfile) {
		return this.#userService.findByGoogleProfile(profile)
	}

	async listAll(): Promise<User[]> {
		return this.#userService.listAll()
	}

	async associateGoogleProfile(user: User, profile: IGoogleProfile) {
		return this.#userService.associateGoogleProfile(user, profile)
	}

	async setOnlineStatus(userId: string, status: boolean): Promise<User> {
		return this.#userService.setOnlineStatus(userId, status)
	}
}

export default new UserController(UserService)
