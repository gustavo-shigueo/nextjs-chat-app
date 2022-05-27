import ICacheProvider from 'providers/cache/ICacheProvider'
import IAllowlistRepository from './IAllowlistRepository'

export default class AllowlistRepository implements IAllowlistRepository {
	#cacheProvider: ICacheProvider

	constructor(cacheProvider: ICacheProvider) {
		this.#cacheProvider = cacheProvider
	}

	async get(key: string): Promise<string | null> {
		return this.#cacheProvider.get(key)
	}

	async destroy(key: string): Promise<void> {
		this.#cacheProvider.destroy(key)
	}

	async add(
		key: string,
		value: string,
		expirationDate: number | Date
	): Promise<void> {
		this.#cacheProvider.add(key, value, expirationDate)
	}

	async containsKey(key: string): Promise<boolean> {
		return this.#cacheProvider.containsKey(key)
	}
}
