import UserService from './UserService'
import UserRepository from 'repositories/User'

export default new UserService(UserRepository)
