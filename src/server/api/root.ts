import { createTRPCRouter } from '../../server/api/trpc'
import { callsRouter } from './routers/calls'
import { chatsRouter } from './routers/chats'
import { contactsRouter } from './routers/contacts'
import { messagesRouter } from './routers/messages'
import { usersRouter } from './routers/users'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	chats: chatsRouter,
	messages: messagesRouter,
	contacts: contactsRouter,
	calls: callsRouter,
	users: usersRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
