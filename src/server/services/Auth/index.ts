import userRepository from '../../../server/repositories/User'
import uuidSerializer from '../../../server/serializers/Uuid'
import emailService from '../Email'
import jwtService from '../Jwt'
import passwordService from '../Password'
import AuthService from './Auth'
import type IAuthService from './IAuth'

const authService: IAuthService = new AuthService(
	userRepository,
	emailService,
	passwordService,
	jwtService,
	uuidSerializer
)

export default authService
export type { IAuthService }
