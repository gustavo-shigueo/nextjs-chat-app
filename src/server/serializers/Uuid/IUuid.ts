export type ReplaceBuffer<T> = T extends Buffer
	? string
	: T extends Array<infer R>
	? ReplaceBuffer<R>[]
	: T extends { [key: string]: unknown }
	? { [K in keyof T]: ReplaceBuffer<T[K]> }
	: T

export interface IUuidSerializer {
	/**
	 * Converts a string uuid in a buffer format used by the database
	 */
	toBuffer(uuid: string): Buffer

	/**
	 * Converts a binary uuid to its string representation
	 */
	stringify(buffer: Buffer): string

	/**
	 * Recursively replaces every buffer value in an object with a string
	 *
	 * Only use this method if every buffer value in your object is a valid uuid buffer
	 */
	deepStringify<T>(object: T): ReplaceBuffer<T>
}
