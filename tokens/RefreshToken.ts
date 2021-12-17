import RedisAllowlistInterface from 'interfaces/RedisAllowlistInterface'
import refreshTokenAllowlist from 'redis/refreshTokenAllowlist'
import OpaqueToken from './OpaqueToken'
import Token from './tokens'

export default class RefreshToken extends Token {
	type = 'refresh'
	maxAge = 60 * 60 * 24 * 7
	expiration = [7, 'd']
	allowlist = refreshTokenAllowlist as RedisAllowlistInterface

	static async create(id: string) {
		return OpaqueToken.create(id, this.expiration, this.allowlist)
	}

	static verify(token: string) {
		return OpaqueToken.verify(token, this.allowlist)
	}

	static invalidate(token: string) {
		return OpaqueToken.invalidate(token, this.allowlist)
	}
}
