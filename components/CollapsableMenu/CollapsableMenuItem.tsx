import { ButtonHTMLAttributes, ReactNode, MouseEventHandler, FC } from 'react'
import classNames from 'utils/classNames'
import Button from 'components/Button'
import styles from './CollapsableMenu.module.scss'

interface ICollapsableMenuItemProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	leftIcon?: ReactNode
	rightIcon?: ReactNode
	onClick: MouseEventHandler
}

const CollapsableMenuItem: FC<ICollapsableMenuItemProps> = ({
	children,
	onClick,
	leftIcon,
	rightIcon,
	style,
	...props
}) => {
	return (
		<li>
			<Button
				variant="flat"
				onClick={onClick}
				className={classNames(styles.collapsableMenuItem, 'text-neutral-900')}
				{...props}
			>
				{leftIcon}
				<span>{children}</span>
				{rightIcon}
			</Button>
		</li>
	)
}

export default CollapsableMenuItem
