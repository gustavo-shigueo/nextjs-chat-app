import CacheProvider from 'providers/cache'
import BlocklistRepository from './BlocklistRepository'

const cacheProvider = new CacheProvider('blocklist:')

export default new BlocklistRepository(cacheProvider)
