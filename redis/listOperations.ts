import { promisify } from 'util'
import { createClient } from 'redis'
import RedisAllowlistInterface from 'interfaces/RedisAllowListInterface'

const listOperations = (
	list: ReturnType<typeof createClient>
): RedisAllowlistInterface => {
	const existsAsync = promisify(list.exists).bind(list)
	const getAsync = promisify(list.get).bind(list)
	const setAsync = promisify(list.set).bind(list)
	const delAsync = promisify(list.del).bind(list)

	return {
		async add(key: string, value: string, expirationDate: number | Date) {
			await setAsync(key, value)
			list.expireAt(key, expirationDate)
		},

		async containsKey(key: string) {
			return (await existsAsync(key)) === 1
		},

		async getValue(key: string): Promise<string> {
			return await getAsync(key)
		},

		async destroy(key: string) {
			await delAsync(key)
		},
	}
}

export default listOperations
