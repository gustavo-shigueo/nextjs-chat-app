import { randomBytes } from 'crypto'
import InvalidOrExpiredTokenError from 'errors/InvalidOrExpiredTokenError'
import ICacheProvider from 'interfaces/ICacheProvider'
import { TExpirationDate } from 'interfaces/IToken'
import ITokenProvider from 'interfaces/ITokenProvider'

const timeUnits = {
	s: 1,
	m: 60,
	h: 3_600,
	d: 86_400,
}

const getCurrentTimeStamp = (): number => {
	return Math.round(new Date().getTime() / 1000)
}

const getExpirationTimestamp = ([time, timeUnit]: TExpirationDate): number => {
	const currentTimestamp = getCurrentTimeStamp()
	return currentTimestamp + time * timeUnits[timeUnit]
}

export default class OpaqueTokenProvider implements ITokenProvider {
	constructor(private list: ICacheProvider) {}

	async create(_id: string, expiration: TExpirationDate): Promise<string> {
		const token = randomBytes(32).toString('hex')
		const expirationTime = getExpirationTimestamp(expiration)

		await this.list.add(token, _id, expirationTime)
		return token
	}

	async verify(token: string): Promise<string> {
		if (!token) throw new InvalidOrExpiredTokenError()

		const id = await this.list.getValue(token)
		if (id) return id

		throw new InvalidOrExpiredTokenError()
	}

	async invalidate(token: string): Promise<void> {
		await this.list.destroy(token)
	}
}
