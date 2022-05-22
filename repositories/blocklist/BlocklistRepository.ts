import { createHash } from 'crypto'
import ICacheProvider from 'providers/cache/ICacheProvider'
import IBlocklistRepository from './IBlocklistRepository'

const generateKeyHash = (key: string) => {
	return createHash('sha256').update(key).digest('hex')
}

export default class BlocklistRepository implements IBlocklistRepository {
	#cacheProvider: ICacheProvider

	constructor(cacheProvider: ICacheProvider) {
		this.#cacheProvider = cacheProvider
	}

	async add(key: string, expirationDate: number | Date): Promise<void> {
		const keyHash = generateKeyHash(key)
		this.#cacheProvider.add(keyHash, '', expirationDate)
	}

	async containsKey(key: string): Promise<boolean> {
		const keyHash = generateKeyHash(key)
		return this.#cacheProvider.containsKey(keyHash)
	}
}
