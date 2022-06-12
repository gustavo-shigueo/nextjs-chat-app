import { ButtonHTMLAttributes, FC, ReactNode } from 'react'
import style from './Button.module.scss'
import classNames from 'utils/classNames'
import Spinner from 'components/Spinner'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean
	variant?:
		| 'primary'
		| 'accent'
		| 'neutral'
		| 'outline-primary'
		| 'outline-accent'
		| 'outline-neutral'
		| 'outline-danger'
		| 'outline-warning'
		| 'outline-success'
		| 'danger'
		| 'warning'
		| 'success'
		| 'flat'
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
	return (
		<button
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
				...HTMLStyle,
			}}
			{...props}
		>
			<span
				style={{
					visibility: loading ? 'hidden' : 'visible',
					display: 'contents',
				}}
			>
				{children}
			</span>
			<Spinner
				style={{
					position: 'absolute',
					top: 'calc(50% - 0.5rem)',
					left: 'calc(50% - 0.5rem)',
					visibility: loading ? 'visible' : 'hidden',
				}}
			/>
		</button>
	)
}

export default Button
