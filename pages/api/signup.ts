import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from 'utils/dbConnect'
import AuthController from 'controllers/Auth'
import giveCredentials from 'middlewares/giveCredentials'
import MethodNotAllowedError from 'errors/MethodNotAllowed'
import errorSerializer from 'middlewares/errorSerializer'

const signup = async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect()

	const { method, body } = req

	if (method !== 'POST') throw new MethodNotAllowedError(method)

	try {
		const { name, email, password } = body

		const user = await AuthController.signup({
			name,
			email,
			password,
		})

		giveCredentials(req, res, user._id)

		res.statusCode = 201
		res.json({ user })
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default signup
