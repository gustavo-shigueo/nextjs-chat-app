import IPasswordProvider from './IPasswordProvider'
import bcrypt from 'bcrypt'

export default class BcryptPasswordProvider implements IPasswordProvider {
	async hash(password: string): Promise<string> {
		return bcrypt.hash(password, 10)
	}

	async verify(password: string, hash: string): Promise<boolean> {
		return bcrypt.compare(password, hash)
	}
}
