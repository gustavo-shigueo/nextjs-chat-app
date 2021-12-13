import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from 'utils/dbConnect'
import UserInterface from 'interfaces/UserInterface'
import AuthController from 'controllers/AuthController'

const signup = async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect()

	const { method, body } = req

	if (method !== 'POST') {
		res.statusCode = 405
		return res.end()
	}

	try {
		const { name, email, password, avatarUrl } = body as UserInterface
		const user = await AuthController.signupWithEmailAndPassword({
			name,
			email,
			password,
			avatarUrl,
		})
		res.json({ user: user.toJSON() })
	} catch (error: any) {
		res.statusCode = 400

		if (Array.isArray(error)) return res.json({ errors: error })
		return res.json({ error: { name: error.name, message: error.message } })
	}
}

export default signup
