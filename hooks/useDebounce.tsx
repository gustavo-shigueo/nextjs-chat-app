import { useEffect, useState } from 'react'

const useDebounce = <T,>(initialValue: T, delay: number = 500) => {
	const [value, setValue] = useState(initialValue)
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const timeout = setTimeout(() => setDebouncedValue(value), delay)

		return () => clearTimeout(timeout)
	}, [delay, value])

	return [value, debouncedValue, setValue] as const
}

export default useDebounce
