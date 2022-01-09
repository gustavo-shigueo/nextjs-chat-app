import { createHash } from 'crypto'
import IBlocklistRepository from 'interfaces/IBlocklistRepository'
import ICacheProvider from 'interfaces/ICacheProvider'
import CacheProvider from 'providers/cache'

const cacheProvider = new CacheProvider('blocklist:')

const generateKeyHash = (key: string) => {
	return createHash('sha256').update(key).digest('hex')
}

class BlocklistRepository implements IBlocklistRepository {
	constructor(private cacheProvider: ICacheProvider) {}

	async add(key: string, expirationDate: number | Date): Promise<void> {
		const keyHash = generateKeyHash(key)
		this.cacheProvider.add(keyHash, '', expirationDate)
	}

	async containsKey(key: string): Promise<boolean> {
		const keyHash = generateKeyHash(key)
		return this.cacheProvider.containsKey(keyHash)
	}
}

export default new BlocklistRepository(cacheProvider)
