import RedisAllowlistInterface from 'interfaces/RedisAllowListInterface'
import RedisBlocklistInterface from 'interfaces/RedisBlocklistInterface'
import { sign, verify, JsonWebTokenError } from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import refreshTokenAllowlist from 'redis/refreshTokenAllowlist'
import accessTokenBlocklist from 'redis/accessTokenBlocklist'
import InvalidOrExpiredTokenError from 'errors/InvalidOrExpiredTokenError'

type TimeUnits = 's' | 'm' | 'h' | 'd'
interface TokenPayload {
	_id: string
}

const timeUnits = {
	s: 1,
	m: 60,
	h: 3600,
	d: 3600 * 24,
}

const getCurrentTimeStamp = (): number =>
	Math.round(new Date().getTime() / 1000)

const getExpirationTimestamp = ([time, timeUnit]: [number, TimeUnits]) => {
	const currentTimestamp = getCurrentTimeStamp()
	return currentTimestamp + time * timeUnits[timeUnit]
}

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

const createOpaqueToken = async (
	id: string,
	expiration: [number, TimeUnits],
	allowlist: RedisAllowlistInterface
) => {
	const token = randomBytes(32).toString('hex')
	const expirationTime = getExpirationTimestamp(expiration)

	await allowlist.add(token, id, expirationTime)
	return token
}

const verifyOpaqueToken = async (
	token: string,
	allowlist: RedisAllowlistInterface
) => {
	if (!token) throw new InvalidOrExpiredTokenError()

	const id = await allowlist.getValue!(token)
	if (id) return id

	throw new InvalidOrExpiredTokenError()
}

const invalidateOpaqueToken = (
	token: string,
	allowlist: RedisAllowlistInterface
) => {
	allowlist.destroy(token)
}

const createJWT = (
	_id: string,
	expiration: [number, TimeUnits],
	secret: string
) => {
	const payload = { _id }
	const token = sign(payload, secret, {
		expiresIn: expiration.join(''),
	})

	return token
}

const verifyJWT = async (
	token: string,
	blocklist: RedisBlocklistInterface,
	secret: string
) => {
	await checkTokenBlocklist(token, blocklist)
	const { _id } = verify(token, secret) as TokenPayload
	return _id
}

const invalidateJWT = (token: string, blocklist: RedisBlocklistInterface) => {
	return blocklist.add(token)
}

class Token {
	static type: string
	static allowlist: RedisAllowlistInterface
	static blocklist: RedisBlocklistInterface
	protected static _secret: string
	static expiration: [number, TimeUnits]
	static create: (id: string) => Promise<string> | string
	static verify: (token: string) => Promise<string> | void
	static invalidate: (token: string) => Promise<void> | void
}

export class RefreshToken extends Token {
	type = 'refresh'
	expiration = [7, 'd']
	allowlist = refreshTokenAllowlist as RedisAllowlistInterface

	static async create(id: string) {
		return createOpaqueToken(
			id,
			RefreshToken.expiration,
			RefreshToken.allowlist
		)
	}

	static verify(token: string) {
		return verifyOpaqueToken(token, RefreshToken.allowlist)
	}

	static invalidate(token: string) {
		return invalidateOpaqueToken(token, RefreshToken.allowlist)
	}
}

export class AccessToken extends Token {
	type = 'refresh'
	expiration = [5, 'm']
	blocklist = accessTokenBlocklist
	_secret = process.env.ACCESS_TOKEN_SECRET!

	static create(_id: string) {
		return createJWT(_id, AccessToken.expiration, AccessToken._secret)
	}

	static async verify(token: string) {
		return verifyJWT(token, AccessToken.blocklist, AccessToken._secret)
	}

	static invalidate(token: string) {
		return invalidateJWT(token, AccessToken.blocklist)
	}
}
