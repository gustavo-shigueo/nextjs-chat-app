export default class MethodNotAllowedError extends Error {
	public method: string
	constructor(_method: string = '') {
		const spacing = _method ? ' ' : ''
		super(`Method${spacing}${_method} not allowed`)
		this.name = 'MethodNotAllowed'
		this.method = _method ?? ''
	}
}
