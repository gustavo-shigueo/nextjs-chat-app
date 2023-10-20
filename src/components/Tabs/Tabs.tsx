import {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	useId,
	useState,
	type HTMLAttributes,
} from 'react'
import { twMerge } from 'tailwind-merge'

type TabsProps = HTMLAttributes<HTMLDivElement> & {
	direction?: 'horizontal' | 'vertical'
	onSelect?: () => void
}

type TabsContextData = {
	id: string
	previousIndex: number
	selectedIndex: number
	direction: 'horizontal' | 'vertical'
	selectIndex: (index: number) => void
	onSelect?: () => void
}

const TabsContext = createContext<TabsContextData>({} as TabsContextData)
export const useTabs = () => useContext(TabsContext)

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
	(
		{ children, className, onSelect, direction = 'horizontal', ...props },
		ref
	) => {
		const id = useId()
		const [previousIndex, setPreviousIndex] = useState(0)
		const [selectedIndex, setSelectedIndex] = useState(0)

		const selectIndex = useCallback(
			(i: number) => {
				setSelectedIndex(previous => {
					setPreviousIndex(previous)
					return i
				})

				onSelect?.()
			},
			[onSelect]
		)

		return (
			<TabsContext.Provider
				value={{
					id,
					previousIndex,
					selectedIndex,
					direction,
					selectIndex,
					onSelect,
				}}
			>
				<div
					ref={ref}
					data-direction={direction}
					className={twMerge(
						'relative grid gap-1 overflow-hidden data-[direction=horizontal]:grid-cols-[1fr] data-[direction=vertical]:grid-cols-[auto_1fr] data-[direction=horizontal]:grid-rows-[auto_1fr] data-[direction=vertical]:grid-rows-[1fr]',
						className
					)}
					{...props}
				>
					{children}
				</div>
			</TabsContext.Provider>
		)
	}
)
Tabs.displayName = 'TabbedPanel'

export default Tabs
