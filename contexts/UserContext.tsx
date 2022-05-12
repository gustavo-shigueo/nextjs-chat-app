import { createContext, useContext, useState, FC } from 'react'
import User from 'entities/User'
import IGoogleProfile from 'interfaces/IGoogleProfile'
import { api } from 'services/axios'

interface IUserContextData {
	isAuthenticated: boolean
	user: User | null
	loading: boolean
	error: any
	signup: ({ profile, googleAccessToken }: IUserData) => Promise<void>
}

interface IEmailAndPassword {
	email: string
	password: string
}

interface IUserData {
	profile?: IEmailAndPassword & { name?: string }
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
		if (profile) {
		}

		if (googleAccessToken) {
		}

		// console.error('No login data provided')
	}

	const logout = async () => {
		// await logoutLogic(args)
		// setUser(null)
	}

	const signup = async ({ profile, googleAccessToken }: IUserData) => {
		if (!profile && !googleAccessToken) return
		if (profile && googleAccessToken) return

		const data = profile ?? { googleAccessToken }
		const path = `/api/sign${profile ? 'up' : 'in-with-google'}`

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
				signup,
			}}
		>
			{children}
		</UserContext.Provider>
	)
}
