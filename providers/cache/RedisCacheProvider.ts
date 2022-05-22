import ICacheProvider from './ICacheProvider'
import { createClient } from 'redis'

export default class RedisCacheProvider implements ICacheProvider {
	#client: ReturnType<typeof createClient>

	constructor(prefix?: string, url?: string) {
		const options: any = { prefix, url }

		if (!prefix) delete options.prefix
		if (!url) delete options.url
		this.#client = createClient(options)
	}

	public async get(key: string): Promise<string | null> {
		if (!this.#client.isOpen) await this.#client.connect()

		return this.#client.get(key)
	}

	public async add(
		key: string,
		value: string,
		expirationDate: number | Date
	): Promise<void> {
		if (!this.#client.isOpen) await this.#client.connect()

		await this.#client.set(key, value.toString())
		this.#client.expireAt(key, expirationDate)
	}

	public async destroy(key: string): Promise<void> {
		if (!this.#client.isOpen) await this.#client.connect()
		this.#client.del(key)
	}

	public async containsKey(key: string): Promise<boolean> {
		if (!this.#client.isOpen) await this.#client.connect()

		return !!this.#client.exists(key)
	}
}
