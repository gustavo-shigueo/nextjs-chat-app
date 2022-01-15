import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from 'utils/dbConnect'
import AuthController from 'controllers/Auth'
import giveCredentials from 'middlewares/authentication/giveCredentials'
import MethodNotAllowedError from 'errors/MethodNotAllowed'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import userSerializer from 'middlewares/serializers/userSerializer'

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

		await giveCredentials(req, res, user._id)

		res.json({ user: userSerializer(user) })
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default signin
