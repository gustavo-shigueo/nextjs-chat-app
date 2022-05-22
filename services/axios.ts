import axios, { AxiosError } from 'axios'
import IError from 'errors/IError'

const api = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api`,
})

export type ApiError = AxiosError<IError, any>

export default api
