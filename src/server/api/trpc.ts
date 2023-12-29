import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type NodeHTTPCreateContextFnOptions } from '@trpc/server/dist/adapters/node-http'
import { type IncomingMessage } from 'http'
import { type Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import superjson from 'superjson'
import type ws from 'ws'
import { getServerAuthSession } from '../../server/auth'
import { prisma } from '../../server/db'

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */
type CreateContextOptions = {
	session: Session | null
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
	return {
		session: opts.session,
		prisma,
	}
}

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (
	opts:
		| CreateNextContextOptions
		| NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
) => {
	const { req, res } = opts

	const session =
		'body' in req && 'json' in res
			? await getServerAuthSession({ req, res })
			: await getSession(opts)

	return createInnerTRPCContext({
		session,
	})
}

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape }) {
		return shape
	},
})

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
	if (!ctx.session || !ctx.session.user) {
		throw new TRPCError({ code: 'UNAUTHORIZED' })
	}

	return next({
		ctx: {
			session: { ...ctx.session, user: ctx.session.user },
		},
	})
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
