import { NextApiRequest, NextApiResponse } from 'next'
import AuthController from 'controllers/Auth'
import giveCredentials from 'middlewares/authentication/giveCredentials'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import publicUserSerializer from 'middlewares/serializers/publicUserSerializer'
import allowMethods from 'middlewares/allowMethods'

const signin = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		allowMethods(req, 'POST')

		const { email, password } = req.body
		const user = await AuthController.signInWithEmailAndPassword(
			email,
			password
		)

		await giveCredentials(req, res, user.id)

		res.json(publicUserSerializer(user))
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default signin
