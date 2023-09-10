import { z } from 'zod'
import userService from '../../../server/services/User'
import { userSchema } from '../schemas/userSchema'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const contactsRouter = createTRPCRouter({
	searchNew: protectedProcedure
		.input(
			z.object({
				search: z.string(),
				cursor: z.date().optional(),
				limit: z.number().optional().default(50),
			})
		)
		.output(z.array(userSchema))
		.query(({ ctx, input: { search, limit, cursor } }) => {
			return userService.searchNewContact(
				ctx.session.user.id,
				search,
				limit,
				cursor
			)
		}),

	list: protectedProcedure.output(z.array(userSchema)).query(({ ctx }) => {
		return userService.findContacts(ctx.session.user.id)
	}),

	add: protectedProcedure
		.input(z.object({ contactId: z.string().uuid() }))
		.output(z.void())
		.mutation(async ({ ctx, input }) => {
			await userService.addContact(ctx.session.user.id, input.contactId)
		}),

	remove: protectedProcedure
		.input(z.object({ contactId: z.string().uuid() }))
		.output(z.void())
		.mutation(async ({ ctx, input }) => {
			await userService.removeContact(ctx.session.user.id, input.contactId)
		}),
})
