import AuthController from 'controllers/Auth'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import giveCredentials from 'middlewares/authentication/giveCredentials'
import { NextApiRequest, NextApiResponse } from 'next'
import allowMethods from 'middlewares/allowMethods'
import userSerializer from 'middlewares/serializers/userSerializer'
import revokeCredentials from 'middlewares/authentication/revokeCredentials'

const signupWithGoogle = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		allowMethods(req, 'POST')

		const { googleAccessToken } = req.body

		const user = await AuthController.signUpWithGoogle(googleAccessToken)

		await giveCredentials(req, res, user.id)

		return res.json(userSerializer(user))
	} catch (error: any) {
		await revokeCredentials(req, res)
		errorSerializer(res, error)
	}
}

export default signupWithGoogle
