export default interface IPasswordProvider {
	/**
	 * Hashes a password with bcrypt
	 * @param {string} password Password to be hashed
	 * @returns {string} Password digest
	 */
	hash(password: string): Promise<string>

	/**
	 * Verifies that the password provided by the user is correct
	 * @param {string} password Plain text password
	 * @param {string} hash Password hash from the database
	 * @returns {boolean} Wheter or not the password matches the hash
	 */
	verify(password: string, hash: string): Promise<boolean>
}
