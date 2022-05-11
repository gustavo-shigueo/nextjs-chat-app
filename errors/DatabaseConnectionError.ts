import IError from './IError'

export default class DatabaseConnectionError extends Error implements IError {
	status = 500
	name = 'DatabaseConnectionFailed'
	message = 'Failed to coonect to database'
}
