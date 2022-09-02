import IBlocklistRepository from 'repositories/Blocklist/IBlocklistRepository'
import { TExpirationDate, TokenPayload } from 'interfaces/IToken'
import ITokenService from './ITokenService'
import { decode, JwtPayload, sign, verify } from 'jsonwebtoken'
import { timeUnits } from './tokenHelperFns'
import InvalidOrExpiredTokenError from 'errors/InvalidOrExpiredTokenError'

export default class JWTTokenService implements ITokenService {
	#list: IBlocklistRepository
	#expiration: TExpirationDate
	#secret: string

	public constructor(
		list: IBlocklistRepository,
		expiration: TExpirationDate,
		secret: string
	) {
		this.#list = list
		this.#expiration = expiration
		this.#secret = secret
	}

	public create(_id: string) {
		const payload = { _id }
		const token = sign(payload, this.#secret, {
			expiresIn: this.#expiration.join(''),
		})

		return token
	}

	public async verify(token: string): Promise<string> {
		if (await this.#list?.containsKey(token)) {
			throw new InvalidOrExpiredTokenError('Token is invalid due to logout')
		}

		try {
			const { _id } = verify(token, this.#secret) as TokenPayload
			return _id
		} catch {
			throw new InvalidOrExpiredTokenError()
		}
	}

	public async invalidate(token: string): Promise<void> {
		const decoded = decode(token) as JwtPayload | null

		if (!decoded) return

		const { exp } = decoded
		await this.#list.add(token, exp ?? timeUnits.d * 30)
	}
}
