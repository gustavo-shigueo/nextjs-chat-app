export default class NotFoundError extends Error {
	constructor(entity: string) {
		super(`${entity} not found`)
		this.name = 'NotFound'
	}
}
