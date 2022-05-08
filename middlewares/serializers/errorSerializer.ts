import IError from 'errors/IError'
import { NextApiResponse } from 'next'

const errorSerializer = (res: NextApiResponse, err: IError) => {
	const { status, ...error } = err
	res.statusCode = status
	res.json(error)
}

export default errorSerializer
