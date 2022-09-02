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

	public constructor(list: IAllowlistRepository, expiration: TExpirationDate) {
		this.#list = list
		this.#expiration = expiration
		this.maxAge = getMaxAge(this.#expiration)
	}

	public async create(_id: string): Promise<string> {
		const token = randomBytes(32).toString('hex')
		const expirationTime = getExpirationTimestamp(this.#expiration)

		await this.#list.add(token, _id, expirationTime)
		return token
	}

	public async verify(token: string): Promise<string> {
		if (!token) throw new InvalidOrExpiredTokenError()

		const id = await this.#list.get(token)
		if (id) return id

		throw new InvalidOrExpiredTokenError()
	}

	public async invalidate(token: string): Promise<void> {
		await this.#list.destroy(token)
	}
}
