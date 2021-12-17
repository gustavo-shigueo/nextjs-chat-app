import AuthController from 'controllers/AuthController'
import UserController from 'controllers/UserController'
import MethodNotAllowedError from 'errors/MethodNotAllowed'
import GoogleProfileInterface from 'interfaces/GoogleProfileInterface'
import errorSerializer from 'middlewares/errorSerializer'
import giveCredentials from 'middlewares/giveCredentials'
import { NextApiRequest, NextApiResponse } from 'next'

const signinWithGoogle = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, body } = req

	if (method !== 'POST') throw new MethodNotAllowedError(method)

	try {
		const { googleId, name, email, imageUrl } = body as GoogleProfileInterface

		const user = await AuthController.signInWithGoogle({
			googleId,
			name,
			email,
			imageUrl,
		})

		giveCredentials(req, res, user._id)

		return res.json({ user: UserController.serializeUser(user) })
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default signinWithGoogle
