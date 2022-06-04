import { ButtonHTMLAttributes, FC, useEffect, useRef, useState } from 'react'
import style from './Button.module.scss'
import classNames from 'utils/classNames'
import Spinner from 'components/Spinner'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean
	spinner?: () => JSX.Element
	variant?:
		| 'primary'
		| 'accent'
		| 'neutral'
		| 'outline-primary'
		| 'outline-accent'
		| 'outline-neutral'
		| 'danger'
		| 'warning'
		| 'success'
		| 'flat'
}

type Size = {
	minWidth: number
	minHeight: number
}

const Button: FC<ButtonProps> = ({
	type = 'button',
	variant = 'primary',
	onClick,
	children,
	loading = false,
	disabled,
	className,
	style: HTMLStyle,
	...props
}) => {
	const [size, setSize] = useState<Size>()
	const btnRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (!btnRef.current) return
		const { width, height } = btnRef.current.getBoundingClientRect()

		setSize({ minWidth: width, minHeight: height })
	}, [])

	return (
		<button
			ref={btnRef}
			className={classNames(
				'box-shadow-small',
				'border-radius-100',
				className,
				style.btn,
				style[`btn-${variant}`]
			)}
			type={type}
			onClick={onClick}
			disabled={loading || disabled}
			style={{
				cursor: loading ? 'not-allowed' : 'pointer',
				...size,
				...HTMLStyle,
			}}
			{...props}
		>
			{loading ? (
				<Spinner
					style={{
						position: 'absolute',
						top: 'calc(50% - 0.5rem)',
						left: 'calc(50% - 0.5rem)',
					}}
				/>
			) : (
				children
			)}
		</button>
	)
}

export default Button
