import accessTokenBlocklist from 'redis/accessTokenBlocklist'
import JWTToken from './JWTToken'
import Token from './tokens'

export default class AccessToken extends Token {
	type = 'refresh'
	expiration = [5, 'm']
	blocklist = accessTokenBlocklist
	_secret = process.env.ACCESS_TOKEN_SECRET!

	static create(_id: string) {
		return JWTToken.create(_id, AccessToken.expiration, AccessToken._secret)
	}

	static async verify(token: string) {
		return JWTToken.verify(token, AccessToken.blocklist, AccessToken._secret)
	}

	static invalidate(token: string) {
		return JWTToken.invalidate(token, AccessToken.blocklist)
	}
}
