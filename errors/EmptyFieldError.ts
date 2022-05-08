import IError from './IError'

export default class EmptyFieldError extends Error implements IError {
	status = 400
	name = 'RequiredFieldWasNotProvided'

	constructor(public fieldName: string) {
		super(`Field '${fieldName}' cannot be blank`)
	}
}
