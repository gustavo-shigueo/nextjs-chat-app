import RedisBlocklistInterface from 'interfaces/RedisBlocklistInterface'
import { ExpirationDate, TokenPayload } from 'interfaces/TokenInterfaces'
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken'
import Token from './tokens'

const checkTokenBlocklist = async (
	token: string,
	blocklist: RedisBlocklistInterface
) => {
	if (!blocklist) return

	const tokenIsBlocked = await blocklist.containsKey(token)
	if (tokenIsBlocked) {
		throw new JsonWebTokenError('Token is invalid due to logout')
	}
}

export default class JWTToken extends Token {
	static create(_id: string, expiration: ExpirationDate, secret: string) {
		const payload = { _id }
		const token = sign(payload, secret, {
			expiresIn: expiration.join(''),
		})

		return token
	}

	static async verify(
		token: string,
		blocklist: RedisBlocklistInterface,
		secret: string
	) {
		await checkTokenBlocklist(token, blocklist)
		const { _id } = verify(token, secret) as TokenPayload
		return _id
	}

	static invalidate(token: string, blocklist: RedisBlocklistInterface) {
		return blocklist.add(token)
	}
}
