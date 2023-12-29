import type { IJwtService } from './IJwt'
import { sign, decode, verify } from 'jsonwebtoken'

export class JwtService implements IJwtService {
	#secret: string

	public constructor(secret: string) {
		this.#secret = secret
	}

	public sign(payload: string | object | Buffer): string {
		return sign(payload, this.#secret, { expiresIn: '1h' })
	}

	public verify<T>(token: string): T {
		return verify(token, this.#secret) as T
	}

	public decode<T>(token: string): T {
		return decode(token) as T
	}
}
