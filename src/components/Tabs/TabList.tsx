import { forwardRef, type HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'
import { useTabs } from './Tabs'

type TabListProps = Omit<HTMLAttributes<HTMLUListElement>, 'role'>

const TabList = forwardRef<HTMLUListElement, TabListProps>(
	({ children, className, ...props }, ref) => {
		const { direction, selectIndex, selectedIndex } = useTabs()

		return (
			<ul
				ref={ref}
				role="tablist"
				data-direction={direction}
				tabIndex={0}
				onKeyDown={e => {
					const tabCount = e.currentTarget.childElementCount
					if (e.key === 'ArrowRight') {
						selectIndex((selectedIndex + 1) % tabCount)
					} else if (e.key === 'ArrowLeft') {
						selectIndex((tabCount + selectedIndex - 1) % tabCount)
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
