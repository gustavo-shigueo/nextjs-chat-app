import EmailAlreadyInUseError from 'errors/EmailAlreadyInUseError'
import EmptyFieldError from 'errors/EmptyFieldError'
import InvalidCredentialsError from 'errors/InvalidCredentialsError'
import InvalidFieldError from 'errors/InvalidFieldError'
import InvalidOrExpiredTokenError from 'errors/InvalidOrExpiredTokenError'
import InvalidSignInMethodError from 'errors/InvalidSignInMethodError'
import MethodNotAllowedError from 'errors/MethodNotAllowed'
import NotAuthenticatedError from 'errors/NotAuthenticatedError'
import NotFoundError from 'errors/NotFoundError'
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'
import { NextApiResponse } from 'next'

const errorSerializer = (res: NextApiResponse, err: any) => {
	let statusCode = 500
	let error: any

	if (err instanceof EmailAlreadyInUseError) {
		statusCode = 400
		error = { name: err.name, message: err.message }
	} else if (err instanceof EmptyFieldError) {
		statusCode = 400
		error = { name: err.name, message: err.message, field: err.fieldName }
	} else if (err instanceof InvalidFieldError) {
		statusCode = 400
		error = { name: err.name, message: err.message, field: err.fieldName }
	} else if (err instanceof InvalidCredentialsError) {
		statusCode = 401
		error = { name: err.name, message: err.message }
	} else if (err instanceof InvalidOrExpiredTokenError) {
		statusCode = 401
		error = { name: err.name, message: err.message }
	} else if (
		err instanceof TokenExpiredError ||
		err instanceof JsonWebTokenError
	) {
		statusCode = 401
		err = new InvalidOrExpiredTokenError()
		error = { name: err.name, message: err.message }
	} else if (err instanceof InvalidSignInMethodError) {
		statusCode = 401
		error = { name: err.name, message: err.message }
	} else if (err instanceof NotAuthenticatedError) {
		statusCode = 401
		error = { name: err.name, message: err.message }
	} else if (err instanceof NotFoundError) {
		statusCode = 404
		error = { name: err.name, message: err.message }
	} else if (err instanceof MethodNotAllowedError) {
		statusCode = 405
		error = { name: err.name, message: err.message, method: err.method }
	} else {
		if (err.errors?.email) {
			err = new InvalidFieldError('Invalid email', 'email')
			statusCode = 400
			error = { name: err.name, message: err.message, field: err.fieldName }
		} else {
			error = err
		}
	}

	res.statusCode = statusCode
	res.json({ error })
}

export default errorSerializer
