import type { IUuidSerializer, ReplaceBuffer } from './IUuid'

export default class UuidSerializer implements IUuidSerializer {
	public toBuffer(uuid: string): Buffer {
		if (!uuid) return Buffer.alloc(16)

		const hex = uuid.replaceAll('-', '')

		if (uuid.length !== 36 || hex.length !== 32) {
			throw new Error(`Invalid UUID string: ${uuid}`)
		}

		return Buffer.from(hex, 'hex')
	}

	public stringify(buffer: Buffer): string {
		if (buffer.length !== 16) {
			throw new Error(`Invalid buffer length for uuid: ${buffer.length}`)
		}

		if (buffer.equals(Buffer.alloc(16))) {
			throw new Error('The provided buffer is empty')
		}

		const str = buffer.toString('hex')
		return (
			str.slice(0, 8) +
			'-' +
			str.slice(8, 12) +
			'-' +
			str.slice(12, 16) +
			'-' +
			str.slice(16, 20) +
			'-' +
			str.slice(20)
		)
	}

	public deepStringify<T>(object: T): ReplaceBuffer<T> {
		if (object instanceof Buffer) {
			return this.stringify(object) as ReplaceBuffer<T>
		}

		if (typeof object !== 'object') return object as ReplaceBuffer<T>

		if (object === null) return object as ReplaceBuffer<T>

		if (Array.isArray(object)) {
			return object.map(item =>
				this.deepStringify(item as unknown)
			) as ReplaceBuffer<T>
		}

		type Key = keyof T
		type Value = (T & object)[Key]

		// Didn't use for..in to avoid going through the prototype chain
		const keys = Object.getOwnPropertyNames(object) as Key[]
		for (const key of keys) {
			const value = object[key]

			if (value instanceof Buffer) {
				object[key] = this.stringify(value) as unknown as Value
				continue
			}

			if (typeof value === 'object' && value) {
				object[key] = this.deepStringify(value) as unknown as Value
			}
		}

		return object as ReplaceBuffer<T>
	}
}
