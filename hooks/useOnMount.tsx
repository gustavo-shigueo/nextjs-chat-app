import { useEffect, useRef } from 'react'

const useOnMount = (callback: Function) => {
	const hasRun = useRef(false)

	useEffect(() => {
		if (hasRun.current) return

		hasRun.current = true
		return callback()
	}, [callback])
}

export default useOnMount
