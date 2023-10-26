import { useEffect, type ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'
import Button from '../Button'
import { useTabs } from './Tabs'

type TabProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'role' | 'id'> & {
	index: number
	active?: boolean
	onSelected?: () => void
}

export default function Tab({
	children,
	className,
	index,
	onClick,
	onSelected,
	active,
	...props
}: TabProps) {
	const { selectIndex, selectedIndex, id, direction, manual } = useTabs()

	useEffect(() => {
		if (active) selectIndex(index)
	}, [active, index, selectIndex])

	useEffect(() => {
		if (selectedIndex === index && !manual) {
			onSelected?.()
		}
	}, [index, selectedIndex, onSelected, manual])

	return (
		<li className="grow" role="presentation">
			<Button
				id={`${id}-${index}`}
				role="tab"
				variant="flat"
				aria-selected={selectedIndex === index}
				data-direction={direction}
				tabIndex={-1}
				onClick={e => {
					selectIndex(index)
					onClick?.(e)
					onSelected?.()
				}}
				className={twMerge(
					'!text-neutral-400 shadow-none is-full before:absolute before:rounded-[inherit] before:bg-neutral-50 before:opacity-0 before:transition-colors aria-selected:!text-neutral-800 aria-selected:before:opacity-100 before:data-[direction=horizontal]:bs-1 before:data-[direction=vertical]:bs-full before:data-[direction=horizontal]:is-full before:data-[direction=vertical]:is-1 before:data-[direction=horizontal]:block-end-0 before:data-[direction=vertical]:inline-start-0 aria-selected:dark:!text-neutral-50',
					className
				)}
				{...props}
			>
				{children}
			</Button>
		</li>
	)
}
