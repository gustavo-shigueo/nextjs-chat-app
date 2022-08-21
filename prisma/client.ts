import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient({
		log: ['query', 'info', 'warn', 'error'],
	})
} else {
	;(global as any).prisma ??= new PrismaClient({
		log: ['warn', 'error'],
	})
	prisma = (global as any).prisma
}

export abstract class PrismaRepository {
	protected async ensureUniqueId(entity: { id: string; [k: string]: any }) {
		while (await this.findById(entity.id).catch(() => null)) {
			entity.id = randomUUID()
		}
	}

	public abstract findById(
		id: string
	): Promise<{ id: string; [k: string]: any }>
}

export default prisma
