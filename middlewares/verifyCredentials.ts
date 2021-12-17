import InvalidOrExpiredTokenError from 'errors/InvalidOrExpiredTokenError'
import NotAuthenticatedError from 'errors/NotAuthenticatedError'
import { NextApiRequest } from 'next'
import AccessToken from 'tokens/AccessToken'

const authMiddleware = async (req: NextApiRequest) => {
	const { authorization } = req.headers
	if (!authorization) throw new NotAuthenticatedError()

	const [, token] = authorization?.split(' ')

	const id = await AccessToken.verify(token)
	if (!id) throw new InvalidOrExpiredTokenError()

	req.body.user = { id }
}

export default authMiddleware
