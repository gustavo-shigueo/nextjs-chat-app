import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from 'utils/dbConnect'
import AuthController from 'controllers/Auth'
import giveCredentials from 'middlewares/giveCredentials'
import MethodNotAllowedError from 'errors/MethodNotAllowed'
import errorSerializer from 'middlewares/errorSerializer'

const signin = async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect()

	const { method, body } = req

	if (method !== 'POST') throw new MethodNotAllowedError(method)

	try {
		const { email, password } = body
		const user = await AuthController.signInWithEmailAndPassword(
			email,
			password
		)

		giveCredentials(req, res, user._id)

		res.json({ user })
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default signin
