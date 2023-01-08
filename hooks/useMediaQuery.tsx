import { useEffect, useState } from 'react'

const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState(false)

	useEffect(() => {
		const handleChange = () => setMatches(window.matchMedia(query).matches)

		const matchMedia = window.matchMedia(query)

		handleChange()

		matchMedia.addEventListener('change', () => handleChange)

		return () => matchMedia.removeEventListener('change', handleChange)
	}, [query])

	return matches
}

export default useMediaQuery
