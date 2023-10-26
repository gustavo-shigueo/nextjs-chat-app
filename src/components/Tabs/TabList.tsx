import { forwardRef, type HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'
import { useTabs } from './Tabs'

type TabListProps = Omit<HTMLAttributes<HTMLUListElement>, 'role'>

const DIRECTION_MAP: Record<
	'horizontal' | 'vertical',
	Record<string, 'PREVIOUS' | 'NEXT'>
> = {
	vertical: {
		ArrowUp: 'PREVIOUS',
		ArrowDown: 'NEXT',
	},
	horizontal: {
		ArrowLeft: 'PREVIOUS',
		ArrowRight: 'NEXT',
	},
} as const

const TabList = forwardRef<HTMLUListElement, TabListProps>(
	({ children, className, ...props }, ref) => {
		const { direction, selectIndex, selectedIndex, loop } = useTabs()

		return (
			<ul
				ref={ref}
				role="tablist"
				data-direction={direction}
				tabIndex={0}
				onKeyDown={e => {
					const tabCount = e.currentTarget.childElementCount

					if (e.key === ' ' || e.key === 'Enter') {
						e.preventDefault()

						const tabs = [
							...e.currentTarget.querySelectorAll(
								'li > [role=tab]' as 'button'
							),
						]
						tabs[selectedIndex]?.click()
					}

					if (DIRECTION_MAP[direction][e.key] === 'NEXT') {
						if (Number.isNaN(selectedIndex)) {
							selectIndex(0)
							return
						}

						if (loop) {
							selectIndex((selectedIndex + 1) % tabCount)
						} else {
							selectIndex(Math.min(selectedIndex + 1, tabCount - 1))
						}
					} else if (DIRECTION_MAP[direction][e.key] === 'PREVIOUS') {
						if (Number.isNaN(selectedIndex)) {
							selectIndex(0)
							return
						}

						if (loop) {
							selectIndex((tabCount + selectedIndex - 1) % tabCount)
						} else {
							selectIndex(Math.max(selectedIndex - 1, 0))
						}
					}
				}}
				className={twMerge(
					'm-[2px] flex list-none items-center justify-around gap-2 outline-offset-1 outline-neutral-50/25 focus-visible:outline-1 data-[direction=vertical]:flex-col',
					className
				)}
				{...props}
			>
				{children}
			</ul>
		)
	}
)
TabList.displayName = 'TabList'

export default TabList
