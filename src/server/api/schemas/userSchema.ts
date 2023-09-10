import { z } from 'zod'

export const userSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(2),
	image: z.string().url(),
	email: z.string().email(),
	createdAt: z.date(),
})

export type UserSchema = z.infer<typeof userSchema>
