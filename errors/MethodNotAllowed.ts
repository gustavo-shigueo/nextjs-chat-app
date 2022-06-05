import IError from './IError'

export default class MethodNotAllowedError extends Error implements IError {
	override name = 'MethodNotAllowed'
	status = 405

	constructor(public method: string = '') {
		super(`Method${method ? ' ' : ''}${method} not allowed`)
	}
}
