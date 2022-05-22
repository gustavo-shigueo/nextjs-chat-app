import { randomBytes } from 'crypto'
import InvalidOrExpiredTokenError from 'errors/InvalidOrExpiredTokenError'
import { TExpirationDate } from 'interfaces/IToken'
import ITokenService from './ITokenService'
import IAllowlistRepository from 'repositories/Allowlist/IAllowlistRepository'
import { getMaxAge, getExpirationTimestamp } from './tokenHelperFns'

export default class OpaqueTokenService implements ITokenService {
	public maxAge: number

	#list: IAllowlistRepository
	#expiration: TExpirationDate

	constructor(list: IAllowlistRepository, expiration: TExpirationDate) {
		this.#list = list
		this.#expiration = expiration
		this.maxAge = getMaxAge(this.#expiration)
	}

	async create(_id: string): Promise<string> {
		const token = randomBytes(32).toString('hex')
		const expirationTime = getExpirationTimestamp(this.#expiration)

		await this.#list.add(token, _id, expirationTime)
		return token
	}

	async verify(token: string): Promise<string> {
		if (!token) throw new InvalidOrExpiredTokenError()

		const id = await this.#list.get(token)
		if (id) return id

		throw new InvalidOrExpiredTokenError()
	}

	async invalidate(token: string): Promise<void> {
		await this.#list.destroy(token)
	}
}
