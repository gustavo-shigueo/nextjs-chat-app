import { useEffect, useState } from 'react'

const useLocalStorage = <T extends Record<string, any> | string | null>(
	key: string
) => {
	const [value, setValue] = useState<T | null>(null)

	useEffect(() => {
		if (value === null) return

		localStorage.setItem(key, JSON.stringify(value))
	}, [value, key])

	useEffect(() => {
		const value = localStorage.getItem(key)

		if (!value) {
			setValue(value as T | null)
			return
		}

		try {
			setValue(JSON.parse(value) as T)
		} catch {
			setValue(value as T)
		}
	}, [key])

	return [value, setValue] as const
}

export default useLocalStorage
