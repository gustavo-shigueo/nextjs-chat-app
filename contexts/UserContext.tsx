import { createContext, useContext, useState, FC } from 'react'
import UserInterface from 'interfaces/UserInterface'

interface UserContextData {
	isAuthenticated: boolean
	user: UserInterface | null
}

const UserContext = createContext({} as UserContextData)

/**
 * Returns the UserContext data
 */
const useAuth = () => useContext(UserContext)

export const UserProvider: FC = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [user, setUser] = useState<UserInterface | null>(null)

	// TODO: implement login, logout and signup
	const login = async () => {
		// const u: User = await loginLogic(args)
		// setUser(u)
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
				isAuthenticated,
			}}
		>
			{children}
		</UserContext.Provider>
	)
}
