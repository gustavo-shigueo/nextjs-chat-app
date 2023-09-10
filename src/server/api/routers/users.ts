import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'
import passwordRegex from '../../../utils/regex/password'
import authService from '../../../server/services/Auth'
import { TRPCError } from '@trpc/server'

export const usersRouter = createTRPCRouter({
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
				await authService.signup(input)
			} catch (e) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					cause: e,
					message: (e as Error).message,
				})
			}
		}),
})
