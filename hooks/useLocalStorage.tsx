import { useEffect, useState } from 'react'

const useLocalStorage = <T extends string | null = string>(
	key: string
): [T | null, (value: T) => void] => {
	const [value, setValue] = useState<T | null>(null)

	useEffect(() => {
		if (value === null) return

		localStorage.setItem(key, value)
	}, [value, key])

	useEffect(() => {
		setValue(localStorage.getItem(key) as T | null)
	}, [key])

	return [value, setValue]
}

export default useLocalStorage
