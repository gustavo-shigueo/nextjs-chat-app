import { useEffect } from 'react'
import useLocalStorage from './useLocalStorage'
import useMediaQuery from './useMediaQuery'

const useTheme = () => {
	const systemPreference = useMediaQuery('(prefers-color-scheme: dark)')
		? 'dark'
		: 'light'

	const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme')

	const toggleTheme = () => {
		if (!theme) return setTheme(systemPreference === 'dark' ? 'light' : 'dark')

		setTheme(theme === 'dark' ? 'light' : 'dark')
	}

	useEffect(() => {
		const t = theme ?? systemPreference

		document.body.parentElement?.classList.toggle('dark', t === 'dark')
		document.body.parentElement?.classList.toggle('light', t === 'light')
	}, [theme, systemPreference])

	return [theme ?? systemPreference, toggleTheme] as const
}

export default useTheme
