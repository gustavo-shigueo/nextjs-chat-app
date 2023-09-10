import bcrypt from 'bcrypt'
import { z } from 'zod'
import passwordRegex from '../../../utils/regex/password'
import type { IPasswordService } from '.'

export default class BcryptPasswordService implements IPasswordService {
	public hash(password: string): Promise<string> {
		z.string()
			.min(8, 'Password must contain at least 8 characters')
			.regex(
				passwordRegex,
				'Password must contain upper and lowercase letters, numbers and symbols'
			)
			.parse(password)

		return bcrypt.hash(password, 10)
	}

	public verify(password: string, hash: string): Promise<boolean> {
		return bcrypt.compare(password, hash)
	}
}
