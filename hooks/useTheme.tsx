import { useEffect } from 'react'
import useLocalStorage from './useLocalStorage'
import useMediaQuery from './useMediaQuery'

const useTheme = (): ['light' | 'dark', () => void] => {
	const systemPreference = useMediaQuery('(prefers-color-scheme: dark)')
		? 'dark'
		: 'light'

	const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme')

	const toggleTheme = () => {
		if (!theme) return setTheme(systemPreference === 'dark' ? 'light' : 'dark')

		setTheme(theme === 'dark' ? 'light' : 'dark')
	}

	useEffect(() => {
		document.body.className = theme ?? systemPreference
	}, [theme, systemPreference])

	return [theme ?? systemPreference, toggleTheme]
}

export default useTheme
