import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from 'utils/dbConnect'
import AuthController from 'controllers/AuthController'
import UserLoginData from 'interfaces/UserLoginData'
import giveCredentials from 'middlewares/giveCredentials'
import UserController from 'controllers/UserController'
import MethodNotAllowedError from 'errors/MethodNotAllowed'
import errorSerializer from 'middlewares/errorSerializer'

const signin = async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect()

	const { method, body } = req

	if (method !== 'POST') throw new MethodNotAllowedError(method)

	try {
		const { email, password } = body as UserLoginData
		const user = await AuthController.signinWithEmailAndPassword({
			email,
			password,
		})

		giveCredentials(req, res, user._id)

		res.json({ user: UserController.serializeUser(user) })
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default signin
