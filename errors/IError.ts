export default interface IError extends Error {
	status: number
	name: string
	method?: string
	fields?: string[]
	message: string
}
