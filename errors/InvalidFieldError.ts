import IError from './IError'

export default class InvalidFieldError extends Error implements IError {
	override name = 'InvalidField'
	status = 400

	constructor(message: string, public fields: string[]) {
		super(message)
	}
}
