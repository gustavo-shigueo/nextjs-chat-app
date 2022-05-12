export default interface IError extends Error {
	status: number
	name: string
	method?: string
	field?: string
	message: string
}
