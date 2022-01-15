import MethodNotAllowedError from 'errors/MethodNotAllowed'
import { NextApiRequest } from 'next'

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'OPTIONS'

const allowMethods = (req: NextApiRequest, ...methods: Method[]) => {
	const { method = '' } = req

	if (!methods.includes(method as Method)) {
		throw new MethodNotAllowedError(method)
	}
}

export default allowMethods
