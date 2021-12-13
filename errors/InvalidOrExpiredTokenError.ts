export default class InvalidOrExpiredTokenError extends Error {
	constructor() {
		super('Invalid or expired token')
		this.name = 'InvalidOrExpiredToken'
	}
}
