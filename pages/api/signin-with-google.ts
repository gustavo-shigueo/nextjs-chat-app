import UserController from 'controllers/UserController'
import GoogleProfileInterface from 'interfaces/GoogleProfileInterface'
import { NextApiRequest, NextApiResponse } from 'next'

const signinWithGoogle = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, body } = req

	if (method !== 'POST') {
		res.statusCode = 405
		return res.end()
	}

	try {
		const { googleId, name, email, imageUrl } = body as GoogleProfileInterface

		const user = await UserController.signInWithGoogle({
			googleId,
			name,
			email,
			imageUrl,
		})

		return res.json({ user })
	} catch (error: any) {
		res.statusCode = 400

		if (Array.isArray(error)) return res.json({ errors: error })

		res.statusCode = 401
		return res.json({ error: { name: error.name, message: error.message } })
	}
}

export default signinWithGoogle
