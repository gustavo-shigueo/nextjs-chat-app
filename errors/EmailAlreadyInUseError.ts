export default class EmailAlreadyInUseError extends Error {
	constructor() {
		super('Email already in use')
		this.name = 'EmailAlreadyInUse'
	}
}
