import {
	createContext,
	useContext,
	useState,
	FC,
	useCallback,
	useEffect,
	ReactNode,
} from 'react'
import api, { ApiError } from 'services/axios'
import IError from 'errors/IError'
import IUser from 'interfaces/IUser'
// @ts-ignore
import { useRouter } from 'next/router'

interface IUserContextData {
	isAuthenticated: boolean
	user: IUser | null
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
	children?: ReactNode
	serverSideUser: IUser | null
	serverSideAccessToken: string | null
	serverSideError?: IError | null
}

export const UserProvider: FC<IUserProviderProps> = ({
	children,
	serverSideAccessToken,
	serverSideUser,
	serverSideError,
}) => {
	const router = useRouter()
	const [user, setUser] = useState<IUser | null>(serverSideUser)
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

			const response = await api.post('/auth/refresh-token')
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

			const { data, headers } = await api.post<IUser>('/auth/me')

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

				const url = `/auth/signin${googleAccessToken ? '-with-google' : ''}`
				const body = profile ?? { googleAccessToken }

				const { data, headers } = await api.post<IUser>(url, body)

				setAccessToken(headers.authorization)
				setUser(data)
				router.push('/dashboard')
			} catch (e: any) {
				setError((e as ApiError).response?.data)
			} finally {
				setLoading(false)
			}
		},
		[router]
	)

	const logout = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)

			await api.post('/auth/signout')
			router.push('/')
		} catch (e: any) {
			setError((e as ApiError).response?.data)
		} finally {
			setLoading(false)
			setAccessToken(null)
			setUser(null)
		}
	}, [router])

	const signup = useCallback(
		async ({ profile, googleAccessToken }: IUserData) => {
			if (!profile && !googleAccessToken) return
			if (profile && googleAccessToken) return

			try {
				setUser(null)
				setError(null)
				setLoading(true)

				const body = profile ?? { googleAccessToken }
				const path = `/auth/signup${profile ? '' : '-with-google'}`

				const { data, headers } = await api.post<IUser>(path, body)
				setUser(data)
				setAccessToken(headers.authorization)
				router.push('/dashboard')
			} catch (e: any) {
				setError((e as ApiError).response?.data)
			} finally {
				setLoading(false)
			}
		},
		[router]
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
