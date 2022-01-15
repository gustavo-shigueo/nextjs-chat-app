import AuthController from 'controllers/Auth'
import MethodNotAllowedError from 'errors/MethodNotAllowed'
import IGoogleProfile from 'interfaces/IGoogleProfile'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import giveCredentials from 'middlewares/authentication/giveCredentials'
import userSerializer from 'middlewares/serializers/userSerializer'
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

		await giveCredentials(req, res, user._id)

		return res.json({ user: userSerializer(user) })
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default signinWithGoogle
