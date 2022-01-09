export default interface IBlocklistRepository {
	/**
	 * Adds data in the form of a key value pair to the cache
	 * @param {string} key
	 * @param {number|Date} expirationDate A date object or a Unix timestamp
	 */
	add(key: string, expirationDate: number | Date): Promise<void>

	/**
	 * Checks if a given key exists in the cache
	 * @param {string} key
	 */
	containsKey(key: string): Promise<boolean>
}
