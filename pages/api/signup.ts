import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from 'utils/dbConnect'
import UserInterface from 'interfaces/UserInterface'
import AuthController from 'controllers/AuthController'
import giveCredentials from 'middlewares/giveCredentials'
import UserController from 'controllers/UserController'
import MethodNotAllowedError from 'errors/MethodNotAllowed'
import errorSerializer from 'middlewares/errorSerializer'

const signup = async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect()

	const { method, body } = req

	if (method !== 'POST') throw new MethodNotAllowedError(method)

	try {
		const { name, email, password, avatarUrl } = body as UserInterface
		const user = await AuthController.signupWithEmailAndPassword({
			name,
			email,
			password,
			avatarUrl,
		})

		giveCredentials(req, res, user._id)

		res.json({ user: UserController.serializeUser(user) })
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default signup
