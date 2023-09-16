import CredentialsProvider from 'next-auth/providers/credentials'
import authService from '../../../server/services/Auth'

export const credentialsProvider = CredentialsProvider({
	credentials: {
		name: { type: 'text' },
		email: { type: 'email' },
		password: { type: 'password' },
	},
	authorize(credentials) {
		if (!credentials) throw new Error('CredentialsNotProvided')

		return authService.authenticate(credentials)
	},
})
