import BcryptPasswordService from './BcryptPassword'
import type IPasswordService from './IPassword'

const passwordService: IPasswordService = new BcryptPasswordService()

export default passwordService
export type { IPasswordService }
