import MethodNotAllowedError from 'errors/MethodNotAllowed'
import { NextApiRequest } from 'next'

type HttpMethodName = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'OPTIONS'

const allowMethods = (req: NextApiRequest, ...methods: HttpMethodName[]) => {
	const { method = '' } = req

	if (!methods.includes(method as HttpMethodName)) {
		throw new MethodNotAllowedError(method)
	}
}

export default allowMethods
