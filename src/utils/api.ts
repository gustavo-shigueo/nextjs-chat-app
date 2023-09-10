import { createWSClient, httpBatchLink, wsLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import { type NextPageContext } from 'next'
import superjson from 'superjson'
import { env } from '../env.js'

import { type AppRouter } from '../server/api/root'

const getBaseUrl = () => {
	if (typeof window !== 'undefined') return ''
	if (process.env.VERCEL_URL) return process.env.VERCEL_URL
	return `http://localhost:${process.env.PORT ?? 3000}`
}

const url = (path: string) => `${getBaseUrl()}${path}`

function getEndingLink(ctx?: NextPageContext | undefined) {
	if (typeof window === 'undefined') {
		return httpBatchLink({
			url: url('/api/trpc'),
			headers() {
				if (!ctx?.req?.headers) return { 'x-ssr': '1' }
				delete ctx.req.headers.connection

				return {
					...ctx.req.headers,
					'x-ssr': '1',
				}
			},
			fetch: (url, options) => {
				return fetch(url, { ...options, credentials: 'include' })
			},
		})
	}

	const client = createWSClient({
		url: env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3001',
	})

	return wsLink({ client })
}

export const api = createTRPCNext<AppRouter>({
	config({ ctx }) {
		return {
			transformer: superjson,
			links: [getEndingLink(ctx)],
		}
	},
	ssr: false,
})

export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
