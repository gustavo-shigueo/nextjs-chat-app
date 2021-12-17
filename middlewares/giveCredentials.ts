import { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'
import AccessToken from 'tokens/AccessToken'
import RefreshToken from 'tokens/RefreshToken'

const giveCredentials = async (
	req: NextApiRequest,
	res: NextApiResponse,
	id?: string
) => {
	if (id) req.body.user = { id }
	const accessToken = AccessToken.create(req.body.user.id)
	const refreshToken = await RefreshToken.create(req.body.user.id)

	res.setHeader('authorization', `Bearer: ${accessToken}`)
	setCookie({ res }, process.env.NEXT_PUBLIC_COOKIE_NAME!, refreshToken, {
		maxAge: RefreshToken.maxAge,
	})
}

export default giveCredentials
