import IError from 'errors/IError'
import { NextApiResponse } from 'next'

const errorSerializer = (res: NextApiResponse, err: IError) => {
	const { status, message, ...error } = err

	res.statusCode = status ?? 500
	res.json({
		...error,
		message: message.replace(/^\w/, message[0].toUpperCase()),
	})
}

export default errorSerializer
