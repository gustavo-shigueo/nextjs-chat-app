import Button from 'components/Button'
import useCollapsable from 'hooks/useCollapsable'
import { FC, HTMLAttributes, ReactNode, useId, useRef } from 'react'
import { IoChevronDown } from 'react-icons/io5'
import classNames from 'utils/classNames'
import styles from './CollapsableMenu.module.scss'

interface CollapsableMenuProps extends HTMLAttributes<HTMLDivElement> {
	trigger?: ReactNode
}

const CollapsableMenu: FC<CollapsableMenuProps> = ({
	role,
	trigger,
	children,
	...props
}) => {
	const id = useId()
	const ref = useRef<HTMLDivElement>(null)
	const isCollapsed = useCollapsable(ref)

	const container = (menu: ReactNode) => {
		return role === 'navigation' ? (
			<nav className={styles.collapsableMenu} ref={ref} {...props}>
				{menu}
			</nav>
		) : (
			<div role={role} className={styles.collapsableMenu} ref={ref} {...props}>
				{menu}
			</div>
		)
	}

	return container(
		<>
			<Button
				variant="flat"
				data-trigger
				className="text-neutral-900"
				aria-controls={id}
				aria-expanded={!isCollapsed}
			>
				{trigger}
				<IoChevronDown style={{ rotate: isCollapsed ? '0deg' : '180deg' }} />
			</Button>

			<ul
				id={id}
				// @ts-ignore React doesn't yet support the inert attribute properly
				// but it's already standardized in the HTML spec
				// TODO: once React fixes this issue, the line below should be turned
				// to inert={isCollapsed} and this comment should be removed
				// eslint-disable-next-line react/no-unknown-property
				inert={isCollapsed ? 'true' : undefined}
				style={{
					translate: isCollapsed ? '0 -100%' : undefined,
					boxShadow: isCollapsed ? 'none' : undefined,
					listStyle: 'none',
				}}
				className={classNames(
					'absolute',
					'font-weight-bold',
					'box-shadow-medium',
					'border-radius-100',
					styles.collapsableMenuList
				)}
			>
				{children}
			</ul>
		</>
	)
}

export default CollapsableMenu
