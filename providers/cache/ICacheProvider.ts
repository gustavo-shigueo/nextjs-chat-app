export default interface ICacheProvider {
	/**
	 * Returns the value associated with a key in the cache
	 * @param {string} key
	 * @returns {string} Cached value
	 */
	get(key: string): Promise<string | null>

	/**
	 * Removes a key from the cache
	 * @param {string} key
	 */
	destroy(key: string): Promise<void>

	/**
	 * Adds data in the form of a key value pair to the cache
	 * @param {string} key
	 * @param {string} value
	 * @param {number|Date} expirationDate A date object or a Unix timestamp
	 */
	add(key: string, value: string, expirationDate: number | Date): Promise<void>

	/**
	 * Checks if a given key exists in the cache
	 * @param {string} key
	 */
	containsKey(key: string): Promise<boolean>

	disconnect(): Promise<void>
}
