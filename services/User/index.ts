import UserService from './UserService'
import UserRepository from 'repositories/User'
import PasswordProvider from 'providers/password'

export default new UserService(UserRepository, PasswordProvider)
