import AuthController from 'controllers/Auth'
import IGoogleProfile from 'interfaces/IGoogleProfile'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import giveCredentials from 'middlewares/authentication/giveCredentials'
import userSerializer from 'middlewares/serializers/publicUserSerializer'
import { NextApiRequest, NextApiResponse } from 'next'
import allowMethods from 'middlewares/allowMethods'

const signinWithGoogle = async (req: NextApiRequest, res: NextApiResponse) => {
	allowMethods(req, 'POST')

	try {
		const { body } = req
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
