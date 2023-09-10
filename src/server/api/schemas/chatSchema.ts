import { z } from 'zod'
import { messageSchema } from './messageSchema'
import { userSchema } from './userSchema'

export const chatSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(2).nullable(),
	thumbnailUrl: z.string().url().nullable(),
	chatType: z.enum(['GroupChat', 'PrivateChat']),
	messages: z.array(messageSchema),
	users: z.array(userSchema),
	creator: userSchema,
	createdAt: z.date(),
})

export type ChatSchema = z.infer<typeof chatSchema>
