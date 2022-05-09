import IBlocklistRepository from 'repositories/Blocklist/IBlocklistRepository'
import { TExpirationDate, TokenPayload } from 'interfaces/IToken'
import ITokenProvider from './ITokenProvider'
import {
	decode,
	JsonWebTokenError,
	JwtPayload,
	sign,
	verify,
} from 'jsonwebtoken'

export default class JWTTokenProvider implements ITokenProvider {
	constructor(private list: IBlocklistRepository) {}

	create(_id: string, expiration: TExpirationDate, secret: string) {
		const payload = { _id }
		const token = sign(payload, secret, {
			expiresIn: expiration.join(''),
		})

		return token
	}

	async verify(token: string, secret: string): Promise<string> {
		if (await this.list?.containsKey(token)) {
			throw new JsonWebTokenError('Token is invalid due to logout')
		}

		const { _id } = verify(token, secret) as TokenPayload
		return _id
	}

	async invalidate(token: string): Promise<void> {
		const { exp } = decode(token) as JwtPayload
		await this.list.add(token, exp ?? 3600 * 24 * 30 /* a month */)
	}
}
