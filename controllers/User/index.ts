import User from 'entities/User'
import ICreateUserRequest from 'interfaces/ICreateUserRequest'
import IGoogleProfile from 'interfaces/IGoogleProfile'
import IUserController from './IUserController'
import IUserService from 'services/User/IUserService'
import UserService from 'services/User'
import UserController from './UserController'

export default new UserController(UserService)
