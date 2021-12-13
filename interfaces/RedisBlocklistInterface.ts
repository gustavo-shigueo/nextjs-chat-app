export default interface RedisBlocklistInterface {
	add: (key: string) => Promise<void>
	containsKey: (key: string) => Promise<boolean>
}
