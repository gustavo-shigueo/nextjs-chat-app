import userRepository from '../../../server/repositories/User'
import uuidSerializer from '../../../server/serializers/Uuid'
import type IUserService from './IUser'
import UserService from './User'

const userService: IUserService = new UserService(
	userRepository,
	uuidSerializer
)

export default userService
export type { IUserService }
