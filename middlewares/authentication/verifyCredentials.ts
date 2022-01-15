import NotAuthenticatedError from 'errors/NotAuthenticatedError'
import { NextApiRequest } from 'next'
import AccessTokenProvider from 'providers/tokens/AccessTokenProvider'

const verifyCredentials = async (req: NextApiRequest) => {
	const { authorization } = req.headers
	if (!authorization) throw new NotAuthenticatedError()

	const [, token] = authorization?.split(' ')

	const id = await AccessTokenProvider.verify(token)
	if (!id) throw new Error() // Error can be blank as a new error is thrown in the catch block

	req.body ||= {}
	req.body.user = { id }
}

export default verifyCredentials
