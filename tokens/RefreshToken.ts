import RedisAllowlistInterface from 'interfaces/RedisAllowlistInterface'
import refreshTokenAllowlist from 'redis/refreshTokenAllowlist'
import OpaqueToken from './OpaqueToken'
import Token from './tokens'

export default class RefreshToken extends Token {
	type = 'refresh'
	expiration = [7, 'd']
	allowlist = refreshTokenAllowlist as RedisAllowlistInterface

	static async create(id: string) {
		return OpaqueToken.create(
			id,
			RefreshToken.expiration,
			RefreshToken.allowlist
		)
	}

	static verify(token: string) {
		return OpaqueToken.verify(token, RefreshToken.allowlist)
	}

	static invalidate(token: string) {
		return OpaqueToken.invalidate(token, RefreshToken.allowlist)
	}
}
