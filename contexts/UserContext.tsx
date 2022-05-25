import {
	createContext,
	useContext,
	useState,
	FC,
	useCallback,
	useEffect,
} from 'react'
import User from 'entities/User'
import api, { ApiError } from 'services/axios'
import IError from 'errors/IError'

interface IUserContextData {
	isAuthenticated: boolean
	user: User | null
	loading: boolean
	error?: IError | null
	accessToken: string | null
	login: ({ profile, googleAccessToken }: IUserData) => Promise<void>
	signup: ({ profile, googleAccessToken }: IUserData) => Promise<void>
	logout: () => Promise<void>
	refresh: () => Promise<void>
}

interface UserProfile {
	name?: string
	email: string
	password: string
}

interface IUserData {
	profile?: UserProfile
	googleAccessToken?: string
}

const UserContext = createContext({} as IUserContextData)

/**
 * Returns the UserContext data
 */
export const useAuth = () => useContext(UserContext)

export interface IUserProviderProps {
	serverSideUser: User | null
	serverSideAccessToken: string | null
	serverSideError?: IError | null
}

export const UserProvider: FC<IUserProviderProps> = ({
	children,
	serverSideAccessToken,
	serverSideUser,
	serverSideError,
}) => {
	const [user, setUser] = useState<User | null>(serverSideUser)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<IError | null | undefined>(serverSideError)
	const [accessToken, setAccessToken] = useState<string | null>(
		serverSideAccessToken
	)
	const isAuthenticated = !!user

	const refresh = useCallback(async () => {
		try {
			setError(null)
			setLoading(true)
			setAccessToken(null)

			const response = await api.post('/refresh-token')
			setAccessToken(response.headers.authorization)
		} catch (e: any) {
			setUser(null)
			setError(e.response.data)
		} finally {
			setLoading(false)
		}
	}, [])

	const me = useCallback(async () => {
		try {
			setUser(null)
			setError(null)
			setLoading(true)
			setAccessToken(null)

			const { data, headers } = await api.post<User>('/me')

			setUser(data)
			setAccessToken(headers.authorization)
		} catch (e: any) {
			setAccessToken(null)
			setError((e as ApiError).response?.data)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		;(api.defaults.headers as any).Authorization = `Bearer ${accessToken}`
	}, [accessToken])

	const login = useCallback(
		async ({ profile, googleAccessToken }: IUserData) => {
			try {
				setUser(null)
				setError(null)
				setLoading(true)
				setAccessToken(null)

				const url = `/signin${googleAccessToken ? '-with-google' : ''}`
				const body = profile ?? { googleAccessToken }

				const { data, headers } = await api.post<User>(url, body)

				setAccessToken(headers.authorization)
				setUser(data)
			} catch (e: any) {
				setError((e as ApiError).response?.data)
			} finally {
				setLoading(false)
			}
		},
		[]
	)

	const logout = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)

			await api.post('/signout')

			setAccessToken(null)
			setUser(null)
		} catch (e: any) {
			setError((e as ApiError).response?.data)
		} finally {
			setLoading(false)
		}
	}, [])

	const signup = useCallback(
		async ({ profile, googleAccessToken }: IUserData) => {
			if (!profile && !googleAccessToken) return
			if (profile && googleAccessToken) return

			try {
				setUser(null)
				setError(null)
				setLoading(true)

				const body = profile ?? { googleAccessToken }
				const path = `/sign${profile ? 'up' : 'in-with-google'}`

				const { data, headers } = await api.post<User>(path, body)
				setUser(data)
				setAccessToken(headers.authorization)
			} catch (e: any) {
				setError((e as ApiError).response?.data)
			} finally {
				setLoading(false)
			}
		},
		[]
	)

	return (
		<UserContext.Provider
			value={{
				user,
				loading,
				error,
				isAuthenticated,
				accessToken,
				login,
				logout,
				signup,
				refresh,
			}}
		>
			{children}
		</UserContext.Provider>
	)
}
