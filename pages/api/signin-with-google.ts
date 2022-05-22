import AuthController from 'controllers/Auth'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import giveCredentials from 'middlewares/authentication/giveCredentials'
import publicUserSerializer from 'middlewares/serializers/publicUserSerializer'
import { NextApiRequest, NextApiResponse } from 'next'
import allowMethods from 'middlewares/allowMethods'

const signinWithGoogle = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		allowMethods(req, 'POST')

		const { googleAccessToken } = req.body

		const user = await AuthController.signInWithGoogle(googleAccessToken)

		await giveCredentials(req, res, user.id)

		return res.json(publicUserSerializer(user))
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default signinWithGoogle
