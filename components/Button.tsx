import { ButtonHTMLAttributes, FC } from 'react'
import style from 'styles/Button.module.css'
import Spinner from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean
	spinner?: () => JSX.Element
	variant?:
		| 'primary'
		| 'secondary'
		| 'outline'
		| 'danger'
		| 'warning'
		| 'success'
}

const Button: FC<ButtonProps> = ({
	type = 'button',
	variant = 'primary',
	onClick,
	children,
	loading = false,
	disabled,
	style: HTMLStyle,
	...props
}) => {
	return (
		<button
			// className={`btn btn-${variant}`}
			className={`${style.btn} ${style[`btn-${variant}`]}`}
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
				style={{ visibility: loading ? 'hidden' : 'visible', font: 'inherit' }}
			>
				{children}
			</span>
			<Spinner
				style={{
					display: loading ? 'block' : 'none',
					position: 'absolute',
					top: 'calc(50% - 0.5rem)',
					left: 'calc(50% - 0.5rem)',
				}}
			/>
		</button>
	)
}

export default Button
