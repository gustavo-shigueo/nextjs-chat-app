import { NextApiRequest, NextApiResponse } from 'next'
import AuthController from 'controllers/Auth'
import giveCredentials from 'middlewares/authentication/giveCredentials'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import allowMethods from 'middlewares/allowMethods'
import UserController from 'controllers/User'
import userSerializer from 'middlewares/serializers/userSerializer'
import revokeCredentials from 'middlewares/authentication/revokeCredentials'

const signin = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		allowMethods(req, 'POST')

		const { email, password } = req.body
		const user = await AuthController.signInWithEmailAndPassword(
			email,
			password
		)

		await giveCredentials(req, res, user.id)

		await UserController.setOnlineStatus(user.id ?? '', true)

		res.json(userSerializer(user))
	} catch (error: any) {
		await revokeCredentials(req, res)
		errorSerializer(res, error)
	}
}

export default signin
