import CacheProvider from 'providers/cache'
import AllowlistRepository from './AllowlistRepository'

const cacheProvider = new CacheProvider('allowlist:')

export default new AllowlistRepository(cacheProvider)
