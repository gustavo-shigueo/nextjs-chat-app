import NotAuthenticatedError from 'errors/NotAuthenticatedError'
import { NextApiRequest, NextApiResponse } from 'next'
import { destroyCookie } from 'nookies'
import AccessTokenProvider from 'providers/tokens/AccessTokenProvider'
import RefreshTokenProvider from 'providers/tokens/RefreshTokenProvider'

const revokeCredentials = async (req: NextApiRequest, res: NextApiResponse) => {
	const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME!
	const { authorization } = req.headers
	const { [cookieName]: refreshToken } = req.cookies

	if (!authorization) throw new NotAuthenticatedError()
	const [, accessToken] = authorization.split(' ')

	const invalidatePromises = [
		AccessTokenProvider.invalidate(accessToken),
		RefreshTokenProvider.invalidate(refreshToken),
	]

	await Promise.all(invalidatePromises)
	destroyCookie({ res }, cookieName)
}

export default revokeCredentials
