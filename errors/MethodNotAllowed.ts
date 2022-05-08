import IError from './IError'

export default class MethodNotAllowedError extends Error implements IError {
	name = 'MethodNotAllowed'
	status = 405

	constructor(public method: string = '') {
		const spacing = method ? ' ' : ''
		super(`Method${spacing}${method} not allowed`)
	}
}
