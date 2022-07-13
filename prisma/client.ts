import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient({
		log: ['query', 'info', 'warn', 'error'],
	})
} else {
	;(global as any).prisma ??= new PrismaClient({
		log: ['info', 'warn', 'error'],
	})
	prisma = (global as any).prisma
}

export default prisma
