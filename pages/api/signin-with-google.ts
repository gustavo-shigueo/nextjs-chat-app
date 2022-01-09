import AuthController from 'controllers/Auth'
import UserController from 'controllers/User'
import MethodNotAllowedError from 'errors/MethodNotAllowed'
import IGoogleProfile from 'interfaces/IGoogleProfile'
import errorSerializer from 'middlewares/errorSerializer'
import giveCredentials from 'middlewares/giveCredentials'
import { NextApiRequest, NextApiResponse } from 'next'

const signinWithGoogle = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, body } = req

	if (method !== 'POST') throw new MethodNotAllowedError(method)

	try {
		const { googleId, name, email, imageUrl } = body as IGoogleProfile

		const user = await AuthController.signInWithGoogle({
			googleId,
			name,
			email,
			imageUrl,
		})

		giveCredentials(req, res, user._id)

		return res.json({ user })
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default signinWithGoogle
