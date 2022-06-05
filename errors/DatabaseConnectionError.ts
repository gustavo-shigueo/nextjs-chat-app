import IError from './IError'

export default class DatabaseConnectionError extends Error implements IError {
	status = 500
	override name = 'DatabaseConnectionFailed'
	override message = 'Failed to coonect to database'
}
