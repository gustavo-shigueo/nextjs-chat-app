import ICacheProvider from 'interfaces/ICacheProvider'
import { createClient } from 'redis'
import { promisify } from 'util'

export default class RedisCacheProvider implements ICacheProvider {
	private client: ReturnType<typeof createClient>
	private getAsync: any
	private setAsync: any
	private existsAsync: any
	private delAsync: any

	constructor(prefix?: string, url?: string) {
		const options: any = { prefix, url }

		if (!prefix) delete options.prefix
		if (!url) delete options.url
		this.client = createClient(options)

		this.getAsync = promisify(this.client.get).bind(this.client)
		this.setAsync = promisify(this.client.set).bind(this.client)
		this.delAsync = promisify(this.client.del).bind(this.client)
		this.existsAsync = promisify(this.client.exists).bind(this.client)
	}

	async getValue(key: string): Promise<string> {
		return await this.getAsync(key)
	}

	async add(
		key: string,
		value: string,
		expirationDate: number | Date
	): Promise<void> {
		await this.setAsync(key, value)
		await this.client.expireAt(key, expirationDate)
	}

	async destroy(key: string): Promise<void> {
		await this.delAsync(key)
	}

	async containsKey(key: string): Promise<boolean> {
		return !!(await this.existsAsync(key))
	}
}
