import ICreateUserRequest from 'interfaces/ICreateUserRequest'
import IUserService from 'services/User/IUserService'
import User from 'entities/User'
import IUserController from './IUserController'

export default class UserController implements IUserController {
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

	async findByName(name: string): Promise<User[]> {
		return this.#userService.findByName(name)
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.#userService.findByEmail(email)
	}

	async findByGoogleAssociatedEmail(email: string): Promise<User | null> {
		return this.#userService.findByGoogleAssociatedEmail(email)
	}

	async listAll(): Promise<User[]> {
		return this.#userService.listAll()
	}

	async associateGoogleProfile(userId: string): Promise<User> {
		return this.#userService.associateGoogleProfile(userId)
	}

	async setOnlineStatus(userId: string, status: boolean): Promise<User> {
		return this.#userService.setOnlineStatus(userId, status)
	}
}
