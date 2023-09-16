import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'
import passwordRegex from '../../../utils/regex/password'
import authService from '../../../server/services/Auth'
import { TRPCError } from '@trpc/server'
import userService from 'src/server/services/User'
import { userSchema } from '../schemas/userSchema'

export const usersRouter = createTRPCRouter({
	get: publicProcedure
		.input(z.object({ id: z.string().uuid() }))
		.output(userSchema)
		.query(({ input }) => userService.findById(input.id)),

	signup: publicProcedure
		.input(
			z.object({
				name: z.string().min(3),
				email: z.string().email(),
				password: z.string().min(8).regex(passwordRegex),
			})
		)
		.mutation(async ({ input }) => {
			try {
				return await authService.signup(input)
			} catch (e) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					cause: e,
					message: (e as Error).message,
				})
			}
		}),

	requestConfirmationEmail: publicProcedure
		.input(z.object({ email: z.string().email() }))
		.mutation(async ({ input }) => {
			await authService.requestConfirmationEmail(input.email)
		}),

	requestPasswordReset: publicProcedure
		.input(z.object({ email: z.string().email() }))
		.mutation(async ({ input }) => {
			await authService.requestPasswordReset(input.email)
		}),

	confirmEmail: publicProcedure
		.input(z.object({ id: z.string().uuid(), token: z.string() }))
		.mutation(async ({ input }) => {
			try {
				await authService.confirmEmail(input.id, input.token)
			} catch (e) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					cause: e,
					message: (e as Error).message,
				})
			}
		}),

	resetPassword: publicProcedure
		.input(
			z.object({
				id: z.string().uuid(),
				token: z.string(),
				password: z.string().min(8).regex(passwordRegex),
			})
		)
		.mutation(async ({ input }) => {
			try {
				await authService.resetPassword(input.id, input.token, input.password)
			} catch (e) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					cause: e,
					message: (e as Error).message,
				})
			}
		}),
})
