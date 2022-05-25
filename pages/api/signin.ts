import { NextApiRequest, NextApiResponse } from 'next'
import AuthController from 'controllers/Auth'
import giveCredentials from 'middlewares/authentication/giveCredentials'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import allowMethods from 'middlewares/allowMethods'
import UserController from 'controllers/User'
import userSerializer from 'middlewares/serializers/userSerializer'

const signin = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		allowMethods(req, 'POST')

		const { email, password } = req.body
		const user = await AuthController.signInWithEmailAndPassword(
			email,
			password
		)

		await UserController.setOnlineStatus(user.id ?? '', true)

		await giveCredentials(req, res, user.id)

		res.json(userSerializer(user))
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default signin
