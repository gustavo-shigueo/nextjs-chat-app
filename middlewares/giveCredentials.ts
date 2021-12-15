import InvalidOrExpiredTokenError from 'errors/InvalidOrExpiredTokenError'
import NotAuthenticatedError from 'errors/NotAuthenticatedError'
import { NextApiRequest, NextApiResponse } from 'next'
import AccessToken from 'tokens/AccessToken'
import RefreshToken from 'tokens/RefreshToken'

const giveCredentials = async (req: NextApiRequest, res: NextApiResponse) => {
	const accessToken = AccessToken.create(req.body.user.id)
	const refreshToken = RefreshToken.create(req.body.user.id)

	res.setHeader('authorization', `Bearer: ${accessToken}`)
	res.setHeader('cookie', `videochat-app-rt=${refreshToken}`)
}

export default giveCredentials
