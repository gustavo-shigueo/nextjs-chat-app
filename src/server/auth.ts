import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { type GetServerSidePropsContext } from 'next'
import {
	getServerSession,
	type DefaultSession,
	type DefaultUser,
	type NextAuthOptions,
} from 'next-auth'
import { prisma } from './db'
import credentialsProvider from './providers/Credentials'
import googleProvider from './providers/Google'
import uuidSerializer from './serializers/Uuid'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			id: string
			name: string
			image: string
		} & DefaultSession['user']
		accessToken: string
	}

	interface User extends DefaultUser {
		id: string
		name: string
		image: string
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string
		name: string
		image: string
		accessToken: string
		refreshToken: string
	}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	session: {
		strategy: 'jwt',
		maxAge: 3_600 * 24 * 7, // 7 days
		updateAge: 60 * 5, // 5 minutes
	},
	pages: {
		signIn: '/',
		error: '/',
	},
	callbacks: {
		jwt({ token, account, user }) {
			if (user) {
				token = { ...token, ...uuidSerializer.deepStringify(user) }
			}

			if (account) {
				switch (account.provider) {
					case 'google':
						if (
							account.userId &&
							account.access_token &&
							account.refresh_token
						) {
							token.id = account.userId
							token.image = token?.picture ?? ''
							token.accessToken = account?.access_token ?? null
							token.refreshToken = account?.refresh_token ?? null
						}
				}
			}

			return token
		},
		session({ session, token }) {
			if (session.user) {
				session.user.id = token.id
				session.user.name = token.name
				session.user.image = token.image
				session.accessToken = token.accessToken ?? null
			}

			return session
		},
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		googleProvider,
		credentialsProvider,
		/**
		 * ...add more providers here.
		 *
		 * Most other providers require a bit more work than the Discord provider. For example, the
		 * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
		 * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
		 *
		 * @see https://next-auth.js.org/providers/github
		 */
	],
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
	req: GetServerSidePropsContext['req']
	res: GetServerSidePropsContext['res']
}) => {
	return getServerSession(ctx.req, ctx.res, authOptions)
}
