import { z } from 'zod'

export const callSchema = z.object({
	id: z.string().uuid(),
	callerId: z.string().uuid(),
	chatId: z.string().uuid(),
	startedAt: z.date(),
	endedAt: z.date().nullable(),
	callType: z.enum(['Audio', 'Video']),
	participants: z
		.array(
			z.object({
				participantId: z.string().uuid(),
				joinedAt: z.date(),
				leftAt: z.date().nullable(),
			})
		)
		.optional(),
})

export type CallSchema = z.infer<typeof callSchema>
