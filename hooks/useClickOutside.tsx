import { RefObject } from 'react'
import useEventListener from './useEventListener'

const useClickOutside = <T extends HTMLElement = HTMLDivElement>(
	element: RefObject<T>,
	callback: (e: MouseEvent) => void
): void => {
	useEventListener('click', e => {
		if (element.current?.contains(e.target as Node)) return
		callback(e)
	})
}

export default useClickOutside
