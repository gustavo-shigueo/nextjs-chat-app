import RedisAllowlistInterface from 'interfaces/RedisAllowListInterface'
import { createClient } from 'redis'
import listOperations from './listOperations'

const allowlist = createClient({ prefix: 'allowlist-refresh-token:' } as any)

export default listOperations(allowlist as ReturnType<typeof createClient>)
