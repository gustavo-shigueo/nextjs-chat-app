import NotAuthenticatedError from 'errors/NotAuthenticatedError'
import { NextApiRequest } from 'next'

const authMiddleware = (req: NextApiRequest) => {
	const { authorization } = req.headers
	if (!authorization) throw new NotAuthenticatedError()

	const [, token] = authorization?.split(' ')
}

export default authMiddleware
