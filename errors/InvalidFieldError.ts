export default class InvalidFieldError extends Error {
	constructor(message: string, public fieldName: string) {
		super(message)
		this.name = 'InvalidField'
	}
}
