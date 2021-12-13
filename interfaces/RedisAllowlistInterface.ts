export default interface RedisAllowlistInterface {
	add: (
		key: string,
		value: string,
		expirationDate: number | Date
	) => Promise<void>
	containsKey: (key: string) => Promise<boolean>
	getValue: (key: string) => Promise<string>
	destroy: (key: string) => Promise<void>
}
