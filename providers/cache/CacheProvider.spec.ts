import { randomInt } from 'crypto'
import CacheProvider from '.'
import ICacheProvider from './ICacheProvider'

describe('CacheProvider tests', () => {
	let provider: ICacheProvider
	let key = `key${randomInt(100)}`
	let val = `val${randomInt(100)}`

	afterAll(async () => {
		await provider.disconnect()
	})

	it('Can add to and read from the cache', async () => {
		provider = new CacheProvider('testing:')

		await provider.add(key, val, new Date(new Date().getFullYear() + 1, 1, 1))

		const inserted = await provider.get(key)

		expect(inserted).toBe(val.toString())
	})

	it('Can delete from the cache', async () => {
		provider = new CacheProvider('testing:')

		await provider.destroy(key)
		expect(await provider.get(key)).toBeNull()
	})

	it('Can verify that a key exists', async () => {
		provider = new CacheProvider('testing:')

		await provider.add(key, val, new Date(new Date().getFullYear() + 1, 1, 1))
		expect(await provider.containsKey(key)).toBeTruthy()

		await provider.destroy(key)
		expect(await provider.containsKey(key)).toBeFalsy()
	})
})
