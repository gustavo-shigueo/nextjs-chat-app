import type { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'
import { z } from 'zod'
import { env } from '../../../env.js'

export async function refreshGoogleToken(token: JWT) {
	try {
		const url = `https://oauth2.googleapis.com/token?${new URLSearchParams({
			client_id: env.GOOGLE_CLIENT_ID ?? '',
			client_secret: env.GOOGLE_CLIENT_SECRET ?? '',
			grant_type: 'refresh_token',
			refresh_token: token.refreshToken,
		}).toString()}`

		const response = await fetch(url, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			method: 'POST',
		})

		const refreshedTokens = z
			.object({
				access_token: z.string(),
				refresh_token: z.string().optional(),
				expires_in: z.number(),
			})
			.parse(await response.json())

		if (!response.ok) {
			throw refreshedTokens
		}

		return {
			...token,
			accessToken: refreshedTokens.access_token,
			accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
			refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
		}
	} catch (error) {
		return { ...token, error: 'RefreshAccessTokenError' }
	}
}

export const googleProvider = GoogleProvider({
	clientId: env.GOOGLE_CLIENT_ID,
	clientSecret: env.GOOGLE_CLIENT_SECRET,
	authorization: {
		params: {
			prompt: 'consent',
			response_type: 'code',
			access_type: 'offline',
		},
	},
})
