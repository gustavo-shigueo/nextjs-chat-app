import { useEffect, useRef, useState, type FC, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
	children: ReactNode
}

const Portal: FC<PortalProps> = ({ children }) => {
	const ref = useRef<Element | null>(null)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		ref.current = document.querySelector<HTMLElement>('#portal')
		setMounted(true)
	}, [])

	if (!mounted || !ref.current) return null

	return createPortal(<>{children}</>, ref.current)
}

export default Portal
