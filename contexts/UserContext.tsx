import { createContext, useContext, useState, FC } from 'react'
import User from 'entities/User'
import IGoogleProfile from 'interfaces/IGoogleProfile'

interface UserContextData {
	isAuthenticated: boolean
	user: User | null
}

interface UserLoginData {
	email: string
	password: string
}

const UserContext = createContext({} as UserContextData)

/**
 * Returns the UserContext data
 */
const useAuth = () => useContext(UserContext)

export const UserProvider: FC = ({ children }) => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	// TODO: implement login, logout and signup
	const login = async (
		profile?: UserLoginData,
		googleProfile?: IGoogleProfile
	) => {
		if (profile) {
		}

		if (googleProfile) {
		}

		console.error('No login data provided')
	}

	const logout = async () => {
		// await logoutLogic(args)
		// setUser(null)
	}

	const signup = async () => {
		// const u: User = await signupLogic(args)
	}

	return (
		<UserContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
			}}
		>
			{children}
		</UserContext.Provider>
	)
}
