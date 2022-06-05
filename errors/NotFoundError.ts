import IError from './IError'

export default class NotFoundError extends Error implements IError {
	override name = 'NotFound'
	status = 404

	constructor(entity: string) {
		super(`${entity} not found`)
	}
}
