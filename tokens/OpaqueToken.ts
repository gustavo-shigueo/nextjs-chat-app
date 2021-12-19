import { randomBytes } from 'crypto'
import InvalidOrExpiredTokenError from 'errors/InvalidOrExpiredTokenError'
import RedisAllowlistInterface from 'interfaces/RedisAllowlistInterface'
import { ExpirationDate } from 'interfaces/TokenInterfaces'
import Token from './tokens'

const timeUnits = {
	s: 1,
	m: 60,
	h: 3_600,
	d: 86_400,
}

const getCurrentTimeStamp = (): number =>
	Math.round(new Date().getTime() / 1000)

const getExpirationTimestamp = ([time, timeUnit]: ExpirationDate) => {
	const currentTimestamp = getCurrentTimeStamp()
	return currentTimestamp + time * timeUnits[timeUnit]
}

export default class OpaqueToken extends Token {
	static async create(
		_id: string,
		expiration: ExpirationDate,
		allowlist: RedisAllowlistInterface
	) {
		const token = randomBytes(32).toString('hex')
		const expirationTime = getExpirationTimestamp(expiration)

		await allowlist.add(token, _id, expirationTime)
		return token
	}

	static async verify(token: string, allowlist: RedisAllowlistInterface) {
		if (!token) throw new InvalidOrExpiredTokenError()

		const id = await allowlist.getValue!(token)
		if (id) return id

		throw new InvalidOrExpiredTokenError()
	}

	static invalidate(token: string, allowlist: RedisAllowlistInterface) {
		allowlist.destroy(token)
	}
}
