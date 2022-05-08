import IError from './IError'

export default class InvalidFieldError extends Error implements IError {
	name = 'InvalidField'
	status = 400

	constructor(public message: string, public field: string) {
		super(message)
	}
}
