import { NextApiRequest, NextApiResponse } from 'next'
import AuthController from 'controllers/Auth'
import giveCredentials from 'middlewares/authentication/giveCredentials'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import allowMethods from 'middlewares/allowMethods'
import userSerializer from 'middlewares/serializers/userSerializer'
import revokeCredentials from 'middlewares/authentication/revokeCredentials'

const signup = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		allowMethods(req, 'POST')

		const { body } = req
		const { name, email, password } = body

		const user = await AuthController.signUpWithEmailAndPassword({
			method: 'emailAndPassword',
			name,
			email,
			password,
		})

		await giveCredentials(req, res, user.id)

		res.statusCode = 201
		res.json(userSerializer(user))
	} catch (error: any) {
		await revokeCredentials(req, res)
		errorSerializer(res, error)
	}
}

export default signup
