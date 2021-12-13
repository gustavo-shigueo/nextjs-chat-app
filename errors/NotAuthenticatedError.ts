export default class NotAuthenticatedError extends Error {
	constructor() {
		super('Not authenticated')
		this.name = 'NotAuthenticated'
	}
}
