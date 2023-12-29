import { forwardRef, useRef, type HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'
import useMediaQuery from '../../hooks/useMediaQuery'
import { useTabs } from './Tabs'

type TabPanelProps = Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'id'> & {
	index: number
}

const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
	({ children, className, index, style, ...props }, ref) => {
		const { id, selectedIndex } = useTabs()
		const localRef = useRef<HTMLDivElement | null>(null)
		const motionSafe = useMediaQuery('(prefers-reduced-motion: no-preference)')

		return (
			<div
				ref={node => {
					localRef.current = node

					if (typeof ref === 'function') ref(node)
					else if (ref) ref.current = node
				}}
				aria-labelledby={`${id}-${index}`}
				role="tabpanel"
				tabIndex={index === selectedIndex ? 0 : -1}
				inert={index !== selectedIndex ? 'true' : undefined}
				className={twMerge(
					'm-1 transition-[translate,opacity] [grid-column-end:-1] [grid-row-end:-1]',
					className
				)}
				style={{
					...style,
					opacity: index === selectedIndex ? 1 : 0,
					translate: motionSafe
						? index > selectedIndex
							? '100%'
							: index < selectedIndex
							? '-100%'
							: undefined
						: undefined,
				}}
				{...props}
			>
				{children}
			</div>
		)
	}
)
TabPanel.displayName = 'TabPanel'

export default TabPanel
