import type {
	ButtonHTMLAttributes,
	FC,
	MouseEventHandler,
	ReactNode,
} from 'react'
import Button from '../Button'

interface ICollapsableMenuItemProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	leftIcon?: ReactNode
	rightIcon?: ReactNode
	onClick: MouseEventHandler
}

const CollapsableMenuItem: FC<ICollapsableMenuItemProps> = ({
	children,
	onClick,
	...props
}) => {
	return (
		<li className="after:bg-neutral-700 after:opacity-40 after:bs-[1px] after:block-end-0 dark:after:bg-neutral-300 [&:not(:last-child)]:relative [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:inset-inline-3">
			<Button
				variant="flat"
				onClick={onClick}
				className="text-start shadow-none is-[100%] before:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-800 dark:focus-visible:outline-neutral-50 [&_>+.content]:text-start [&_>_span_>_.content]:justify-self-start"
				{...props}
			>
				<p className="grow text-start">{children}</p>
			</Button>
		</li>
	)
}

export default CollapsableMenuItem
