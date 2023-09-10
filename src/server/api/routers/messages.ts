import { observable } from '@trpc/server/observable'
import { z } from 'zod'
import chatService from '../../../server/services/Chat'
import messageService from '../../../server/services/Message'
import MessageEventEmitter from '../events/MessageEventEmitter'
import type { ChatSchema } from '../schemas/chatSchema'
import { messageSchema, type MessageSchema } from '../schemas/messageSchema'
import { createTRPCRouter, protectedProcedure } from '../trpc'

const eventEmitter = new MessageEventEmitter()

export const messagesRouter = createTRPCRouter({
	listByChat: protectedProcedure
		.input(
			z.object({
				chatId: z.string().uuid(),
				cursor: z.date().optional(),
				limit: z.number().optional().default(50),
			})
		)
		.output(z.array(messageSchema))
		.query(async ({ input: { chatId, limit, cursor } }) => {
			const messages = await messageService.findByChatId(chatId, limit, cursor)

			return messages
		}),

	send: protectedProcedure
		.input(
			z.object({
				chatId: z.string().uuid(),
				text: z.string().min(1),
				sentAt: z.date(),
			})
		)
		.output(messageSchema)
		.mutation(async ({ ctx, input: { chatId, sentAt, text } }) => {
			const [chat, message] = await Promise.all([
				chatService.findById(chatId),
				messageService.create(ctx.session.user.id, chatId, text, sentAt),
			])

			eventEmitter.emit('send', chat, message)
			return message
		}),

	receive: protectedProcedure.subscription(({ ctx }) => {
		const id = ctx.session.user.id

		return observable<MessageSchema>(observer => {
			function handle(chat: ChatSchema, message: MessageSchema) {
				if (message.senderId !== id && chat.users.some(u => u.id === id)) {
					observer.next(message)
				}
			}

			eventEmitter.on('send', handle)
			return () => eventEmitter.off('send', handle)
		})
	}),
})
