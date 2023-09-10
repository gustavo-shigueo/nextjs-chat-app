import { observable } from '@trpc/server/observable'
import { z } from 'zod'
import callService from '../../../server/services/Call'
import chatService from '../../../server/services/Chat'
import CallEventEmitter from '../events/CallEventEmitter'
import { callSchema, type CallSchema } from '../schemas/callSchema'
import { type ChatSchema } from '../schemas/chatSchema'
import {
	signalDataSchema,
	type SignalSchema,
} from '../schemas/signalDataSchema'
import { createTRPCRouter, protectedProcedure } from '../trpc'

const eventEmitter = new CallEventEmitter()

export const callsRouter = createTRPCRouter({
	start: protectedProcedure
		.input(
			z.object({
				chatId: z.string().uuid(),
				callType: z.enum(['Audio', 'Video']),
			})
		)
		.output(callSchema)
		.mutation(async ({ ctx, input: { chatId, callType } }) => {
			const call = await callService.create(
				ctx.session.user.id,
				chatId,
				callType
			)
			const chat = await chatService.findById(call.chatId)

			eventEmitter.emit('start', chat, call)

			return call
		}),

	receive: protectedProcedure.subscription(({ ctx }) => {
		const id = ctx.session.user.id

		return observable<CallSchema>(observer => {
			function handle(chat: ChatSchema, call: CallSchema) {
				if (id !== call.callerId && chat.users.some(u => u.id === id)) {
					observer.next(call)
				}
			}

			eventEmitter.on('start', handle)
			return () => eventEmitter.off('start', handle)
		})
	}),

	join: protectedProcedure
		.input(z.object({ callId: z.string().uuid() }))
		.output(callSchema)
		.mutation(async ({ ctx, input }) => {
			const call = await callService.userJoin(input.callId, ctx.session.user.id)

			eventEmitter.emit('userJoin', call, ctx.session.user.id)

			return call
		}),

	userJoined: protectedProcedure.subscription(({ ctx }) => {
		const id = ctx.session.user.id

		return observable<{ call: CallSchema; userId: string }>(observer => {
			function handle(call: CallSchema, userId: string) {
				if (
					userId !== id &&
					call.participants?.some(
						p => p.participantId === id && p.leftAt === null
					)
				) {
					console.log(id)
					observer.next({ call, userId })
				}
			}

			eventEmitter.on('userJoin', handle)
			return () => eventEmitter.off('userJoin', handle)
		})
	}),

	reject: protectedProcedure
		.input(z.object({ callerId: z.string().uuid() }))
		.mutation(({ input }) => {
			eventEmitter.emit('userReject', input.callerId)
		}),

	userRejected: protectedProcedure.subscription(({ ctx }) => {
		const id = ctx.session.user.id

		return observable<undefined>(observer => {
			function handle(callerId: string) {
				if (id === callerId) {
					observer.next(undefined)
				}
			}

			eventEmitter.on('userReject', handle)
			return () => eventEmitter.off('userReject', handle)
		})
	}),

	leave: protectedProcedure
		.input(z.object({ callId: z.string().uuid() }))
		.output(callSchema)
		.mutation(async ({ ctx, input }) => {
			const call = await callService.userLeave(
				input.callId,
				ctx.session.user.id
			)

			if (call.participants?.length === 0) {
				await callService.end(call.id)
			}

			eventEmitter.emit('userLeave', call, ctx.session.user.id)

			return call
		}),

	userLeft: protectedProcedure.subscription(({ ctx }) => {
		const id = ctx.session.user.id

		return observable<{ call: CallSchema; userId: string }>(observer => {
			function handle(call: CallSchema, userId: string) {
				if (
					userId !== id &&
					call.participants?.some(
						p => p.participantId === id && p.leftAt === null
					)
				) {
					observer.next({ call, userId })
				}
			}

			eventEmitter.on('userLeave', handle)
			return () => eventEmitter.off('userLeave', handle)
		})
	}),

	sendOffer: protectedProcedure
		.input(
			z.object({
				offer: signalDataSchema,
				to: z.string().uuid(),
			})
		)
		.mutation(({ ctx, input }) => {
			eventEmitter.emit('rtcOffer', input.offer, ctx.session.user.id, input.to)
		}),

	receiveRtcOffer: protectedProcedure.subscription(({ ctx }) => {
		const id = ctx.session.user.id

		return observable<{
			offer: SignalSchema
			from: string
		}>(observer => {
			function handle(offer: SignalSchema, from: string, to: string) {
				if (id === to) {
					observer.next({ offer, from })
				}
			}

			eventEmitter.on('rtcOffer', handle)
			return () => eventEmitter.off('rtcOffer', handle)
		})
	}),

	sendAnswer: protectedProcedure
		.input(
			z.object({
				answer: signalDataSchema,
				to: z.string().uuid(),
			})
		)
		.mutation(({ ctx, input }) => {
			eventEmitter.emit(
				'rtcAnswer',
				input.answer,
				ctx.session.user.id,
				input.to
			)
		}),

	receiveRtcAnswer: protectedProcedure.subscription(({ ctx }) => {
		const id = ctx.session.user.id

		return observable<{
			answer: SignalSchema
			from: string
		}>(observer => {
			function handle(answer: SignalSchema, from: string, to: string) {
				if (id === to) {
					observer.next({ answer, from })
				}
			}

			eventEmitter.on('rtcAnswer', handle)
			return () => eventEmitter.off('rtcAnswer', handle)
		})
	}),
})
