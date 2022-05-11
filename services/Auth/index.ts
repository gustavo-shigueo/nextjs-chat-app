import PasswordProvider from 'providers/password'
import UserService from 'services/User'
import AuthService from './AuthService'

export default new AuthService(UserService, PasswordProvider)
