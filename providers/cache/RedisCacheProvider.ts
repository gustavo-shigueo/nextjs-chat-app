import ICacheProvider from './ICacheProvider'
import { createClient } from 'redis'

export default class RedisCacheProvider implements ICacheProvider {
	#client: ReturnType<typeof createClient>
	#prefix: string

	constructor(prefix: string, url?: string) {
		const options = url ? { url } : {}

		this.#prefix = prefix
		this.#client = createClient(options)
	}

	public async get(key: string): Promise<string | null> {
		if (!this.#client.isOpen) await this.#client.connect()

		return this.#client.get(`${this.#prefix}${key}`)
	}

	public async add(
		key: string,
		value: string,
		expirationDate: number | Date
	): Promise<void> {
		if (!this.#client.isOpen) await this.#client.connect()

		await this.#client.set(`${this.#prefix}${key}`, value.toString())
		this.#client.expireAt(`${this.#prefix}${key}`, expirationDate)
	}

	public async destroy(key: string): Promise<void> {
		if (!this.#client.isOpen) await this.#client.connect()
		this.#client.del(`${this.#prefix}${key}`)
	}

	public async containsKey(key: string): Promise<boolean> {
		if (!this.#client.isOpen) await this.#client.connect()

		const exists = await this.#client.exists(`${this.#prefix}${key}`)
		return !!exists
	}
}
