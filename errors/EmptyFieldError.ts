import IError from './IError'

export default class EmptyFieldError extends Error implements IError {
	status = 400
	override name = 'RequiredFieldWasNotProvided'

	constructor(public fields: string[]) {
		super(`Field '${fields[0]}' cannot be blank`)
	}
}
