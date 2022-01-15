import InvalidOrExpiredTokenError from 'errors/InvalidOrExpiredTokenError'
import { NextApiRequest, NextApiResponse } from 'next'
import RefreshTokenProvider from 'providers/tokens/RefreshTokenProvider'
import giveCredentials from './giveCredentials'

const refreshCredentials = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { [process.env.NEXT_PUBLIC_COOKIE_NAME!]: refreshToken } = req.cookies
	const id = await RefreshTokenProvider.verify(refreshToken)

	if (!id) throw new InvalidOrExpiredTokenError()

	await giveCredentials(req, res, id)
	await RefreshTokenProvider.invalidate(refreshToken)
}

export default refreshCredentials
