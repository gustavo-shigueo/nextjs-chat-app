import { type MutableRefObject, useRef, useState } from 'react'

function useRefState<T>(): [
	T | undefined,
	MutableRefObject<T | undefined>,
	(value: T | undefined | ((prev: T | undefined) => T | undefined)) => void
]
function useRefState<T>(
	initialValue: T
): [T, MutableRefObject<T>, (value: T | ((prev: T) => T)) => void]
function useRefState<T>(initialValue?: T) {
	const ref = useRef(initialValue)
	const [state, setState] = useState(initialValue)

	const setter = (
		value: T | undefined | ((prev: T | undefined) => T | undefined)
	) => {
		setState(value)

		if (typeof value === 'function') {
			ref.current = (value as (prev: T | undefined) => T | undefined)(
				ref.current
			)
		} else {
			ref.current = value
		}
	}

	return [state, ref, setter]
}

export default useRefState
