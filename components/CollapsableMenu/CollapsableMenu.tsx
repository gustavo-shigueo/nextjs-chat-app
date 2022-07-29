import List from 'components/List'
import useEventListener from 'hooks/useEventListener'
import {
	DetailedHTMLProps,
	HTMLAttributes,
	KeyboardEventHandler,
	ReactNode,
	useRef,
	useState,
} from 'react'
import classNames from 'utils/classNames'
import styles from './CollapsableMenu.module.scss'

interface CollapsableMenuProps<MenuOption>
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	isNav: boolean
	trigger: (props: { isOpen: boolean; isClosing: boolean }) => ReactNode
	menuOptions: MenuOption[]
	render: (item: MenuOption) => ReactNode
}

const CollapsableMenu = <T extends { id: number | string }>({
	isNav,
	trigger,
	menuOptions,
	render,
	...props
}: CollapsableMenuProps<T>) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isClosing, setIsClosing] = useState(false)
	const submenuRef = useRef<HTMLDivElement>(null)
	const toggleRef = useRef<HTMLDivElement>(null)

	const handleBlur = (e: FocusEvent) => {
		if (!isOpen) return

		const tabbedTo = e.relatedTarget as HTMLElement
		if (!toggleRef.current?.contains(tabbedTo)) return setIsClosing(true)

		tabbedTo?.addEventListener('blur', handleBlur, { once: true })
	}

	useEventListener('blur', handleBlur, toggleRef)

	useEventListener(
		'animationend',
		() => {
			if (!isClosing) return

			setIsClosing(false)
			setIsOpen(false)
		},
		submenuRef
	)

	const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = e => {
		if (!['enter', ' '].includes(e.key.toLowerCase())) return

		e.preventDefault()
		setIsOpen(o => !o)
	}

	const handleClick = () => {
		const setState = isOpen ? setIsClosing : setIsOpen
		setState(true)
	}

	return (
		<div
			className={classNames(styles['collapsable-menu'], 'relative')}
			ref={toggleRef}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			{...props}
		>
			<span className={styles['collapsable-menu-trigger']}>
				{trigger({ isOpen, isClosing })}
			</span>

			<List
				items={menuOptions}
				render={render}
				data-closing={isClosing}
				className={classNames(
					'absolute',
					'text-bold',
					styles['collapsable-menu-options'],
					{ hide: !isOpen }
				)}
			/>
		</div>
	)
}

export default CollapsableMenu
