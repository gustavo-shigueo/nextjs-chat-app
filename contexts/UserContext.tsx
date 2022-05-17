import { createContext, useContext, useState, FC } from 'react'
import User from 'entities/User'
import { api } from 'services/axios'

interface IUserContextData {
	isAuthenticated: boolean
	user: User | null
	loading: boolean
	error: any
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
	const [error, setError] = useState<any>(null)
	const isAuthenticated = !!user

	// TODO: implement login, logout and signup
	const login = async ({ profile, googleAccessToken }: IUserData) => {
		setLoading(true)
		try {
			if (profile) {
				const res = await api.post('/signin', profile)
				setUser(res.data.user)
				setError(null)

				return
			}

			if (googleAccessToken) {
				const res = await api.post('/signin-with-google', { googleAccessToken })
				setUser(res.data.user)
				setError(null)

				return
			}
		} catch (e: any) {
			setUser(null)
			setError(e.response.data)
		} finally {
			setLoading(false)
		}
	}

	const logout = async () => {
		// await logoutLogic(args)
		// setUser(null)
	}

	const signup = async ({ profile, googleAccessToken }: IUserData) => {
		if (!profile && !googleAccessToken) return
		if (profile && googleAccessToken) return

		const data = profile ?? { googleAccessToken }
		const path = `/sign${profile ? 'up' : 'in-with-google'}`

		setLoading(true)
		try {
			const res = await api.post(path, data)
			setUser(res.data.user)
			setError(null)
		} catch (e: any) {
			setUser(null)
			setError(e.response.data.error)
		} finally {
			setLoading(false)
		}
	}

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
