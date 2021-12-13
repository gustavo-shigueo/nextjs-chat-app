export default class EmptyFieldError extends Error {
	constructor(public fieldName: string) {
		super(`Field ${fieldName} cannot be blank`)
		this.name = 'RequiredFieldWasNotProvided'
	}
}
