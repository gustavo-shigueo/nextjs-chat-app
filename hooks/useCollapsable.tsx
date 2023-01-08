import { RefObject, useState } from 'react'
import useEventListener from './useEventListener'

const useCollapsable = <T extends HTMLElement = HTMLDivElement>(
	element: RefObject<T>
): boolean => {
	const [isCollapsed, setIsCollapsed] = useState(true)

	const handleLeave = (e: MouseEvent | FocusEvent) => {
		if (element.current?.contains(e.target as Node)) return
		setIsCollapsed(true)
	}

	useEventListener('click', () => setIsCollapsed(c => !c), element)

	useEventListener('click', handleLeave)
	useEventListener('focusin', handleLeave)

	useEventListener('keydown', ({ key }) => {
		if (key !== 'Escape') return
		setIsCollapsed(true)
	})

	return isCollapsed
}

export default useCollapsable
