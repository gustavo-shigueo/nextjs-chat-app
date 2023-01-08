import { ButtonHTMLAttributes, FC } from 'react'
import classNames from 'utils/classNames'
import Spinner from 'components/Spinner'
import styles from './Button.module.scss'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean
	outline?: boolean
	variant?:
		| 'primary'
		| 'accent'
		| 'neutral'
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
	outline,
	...props
}) => (
	<button
		className={classNames(className, styles.button)}
		data-type={variant}
		data-outline={outline}
		onClick={onClick}
		type={type}
		disabled={loading || disabled}
		style={{
			color: loading ? 'transparent' : undefined,
			...HTMLStyle,
		}}
		{...props}
	>
		{children}
		{loading && (
			<Spinner
				style={{
					position: 'absolute',
					top: 'calc(50% - 0.5rem)',
					left: 'calc(50% - 0.5rem)',
				}}
			/>
		)}
	</button>
)

export default Button
