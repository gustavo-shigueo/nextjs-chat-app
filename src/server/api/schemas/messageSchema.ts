import { z } from 'zod'

export const messageSchema = z.object({
	id: z.string().uuid(),
	text: z.string().min(1),
	sentAt: z.date(),
	senderId: z.string().uuid(),
	chatId: z.string().uuid(),
})

export type MessageSchema = z.infer<typeof messageSchema>
