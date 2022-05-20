import { createContext, useContext, useState, FC, useCallback } from 'react'
import User from 'entities/User'
import { api } from 'services/axios'
import IError from 'errors/IError'

interface IUserContextData {
	isAuthenticated: boolean
	user: User | null
	loading: boolean
	error: IError | null
	login: ({ profile, googleAccessToken }: IUserData) => Promise<void>
	signup: ({ profile, googleAccessToken }: IUserData) => Promise<void>
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

export const UserProvider: FC = ({ children }) => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<IError | null>(null)
	const isAuthenticated = !!user

	// TODO: implement login, logout and signup
	const login = useCallback(
		async ({ profile, googleAccessToken }: IUserData) => {
			setUser(null)
			setError(null)
			setLoading(true)

			try {
				if (profile) {
					const res = await api.post('/signin', profile)
					return setUser(res.data.user)
				}

				if (googleAccessToken) {
					const res = await api.post('/signin-with-google', {
						googleAccessToken,
					})

					return setUser(res.data.user)
				}
			} catch (e: any) {
				setError(e.response.data)
			} finally {
				setLoading(false)
			}
		},
		[]
	)

	const logout = useCallback(async () => {
		// await logoutLogic(args)
		// setUser(null)
	}, [])

	const signup = useCallback(
		async ({ profile, googleAccessToken }: IUserData) => {
			if (!profile && !googleAccessToken) return
			if (profile && googleAccessToken) return

			setUser(null)
			setError(null)
			setLoading(true)

			const data = profile ?? { googleAccessToken }
			const path = `/sign${profile ? 'up' : 'in-with-google'}`

			try {
				const res = await api.post(path, data)
				setUser(res.data.user)
			} catch (e: any) {
				setError(e.response.data)
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
				login,
				signup,
			}}
		>
			{children}
		</UserContext.Provider>
	)
}
