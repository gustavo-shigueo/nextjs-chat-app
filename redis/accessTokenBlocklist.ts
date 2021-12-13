import { createHash } from 'crypto'
import RedisBlocklistInterface from 'interfaces/RedisBlocklistInterface'
import { decode, JwtPayload } from 'jsonwebtoken'
import { createClient } from 'redis'
import listOperations from './listOperations'

const blocklist = createClient({ prefix: 'blocklist-access-token:' } as any)
const blockListOperations = listOperations(
	blocklist as ReturnType<typeof createClient>
)

const generateTokenHash = (token: string) => {
	return createHash('sha256').update(token).digest('hex')
}

const add = async (token: string) => {
	const expirationDate = (decode(token) as JwtPayload).exp!
	const tokenHash = generateTokenHash(token)
	blockListOperations.add(tokenHash, '', expirationDate)
}

const containsKey = async (token: string) => {
	const tokenHash = generateTokenHash(token)
	return blockListOperations.containsKey(tokenHash)
}

const allowedOperations: RedisBlocklistInterface = { add, containsKey }

export default allowedOperations
