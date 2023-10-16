import { TRPCError } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import { z } from 'zod'
import ChatTypeError from '../../../server/errors/ChatType'
import UnauthorizedError from '../../../server/errors/Unauthorized'
import chatService from '../../../server/services/Chat'
import ChatEventEmitter from '../events/ChatEventEmitter'
import { chatSchema, type ChatSchema } from '../schemas/chatSchema'
import { createTRPCRouter, protectedProcedure } from '../trpc'

const eventEmitter = new ChatEventEmitter()

export const chatsRouter = createTRPCRouter({
	list: protectedProcedure.output(z.array(chatSchema)).query(({ ctx }) => {
		return chatService.findByParticipantId(ctx.session.user.id)
	}),

	createChat: protectedProcedure
		.input(z.object({ contactId: z.string().uuid() }))
		.output(chatSchema)
		.mutation(async ({ ctx, input }) => {
			const chat = await chatService.createPrivateChat(
				ctx.session.user.id,
				input.contactId
			)

			eventEmitter.emit('create', chat)

			return chat
		}),

	createGroup: protectedProcedure
		.input(
			z.object({ name: z.string().min(1), members: z.array(z.string().uuid()) })
		)
		.output(chatSchema)
		.mutation(async ({ ctx, input }) => {
			const chat = await chatService.createGroupChat(
				input.name,
				ctx.session.user.id,
				input.members
			)

			eventEmitter.emit('create', chat)

			return chat
		}),

	addUser: protectedProcedure
		.input(z.object({ chatId: z.string().uuid(), userId: z.string().uuid() }))
		.mutation(async ({ input, ctx }) => {
			try {
				const chat = await chatService.addUser(
					input.chatId,
					ctx.session.user.id,
					input.userId
				)

				eventEmitter.emit('addmember', chat)

				return chat
			} catch (e) {
				if (e instanceof UnauthorizedError) {
					throw new TRPCError({
						code: 'UNAUTHORIZED',
						message: e.message,
					})
				}

				if (e instanceof ChatTypeError) {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: e.message,
					})
				}

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: e instanceof Error ? e.message : 'Unknown error',
				})
			}
		}),

	newChat: protectedProcedure.subscription(({ ctx }) => {
		const id = ctx.session.user.id

		return observable<ChatSchema>(observer => {
			const handle = (chat: ChatSchema) => {
				if (chat.creator.id === id || chat.users.every(u => u.id !== id)) {
					return
				}

				observer.next(chat)
			}

			eventEmitter.on('create', handle)
			return () => eventEmitter.off('create', handle)
		})
	}),

	newMember: protectedProcedure.subscription(({ ctx }) => {
		const id = ctx.session.user.id

		return observable<ChatSchema>(observer => {
			function handle(chat: ChatSchema) {
				if (chat.creator.id === id || chat.users.every(u => u.id !== id)) {
					return
				}

				observer.next(chat)
			}

			eventEmitter.on('addmember', handle)
			return () => eventEmitter.off('addmember', handle)
		})
	}),
})
