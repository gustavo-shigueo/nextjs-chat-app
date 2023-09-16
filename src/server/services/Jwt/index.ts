import { env } from '../../../env'
import type { IJwtService } from './IJwt'
import { JwtService } from './Jwt'

const jwtService: IJwtService = new JwtService(env.JWT_SECRET)

export default jwtService
export type { IJwtService }
