import { ButtonHTMLAttributes, FC } from 'react'
import style from './Button.module.scss'
import classNames from 'utils/classNames'
import Spinner from 'components/Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
			className={classNames(
				'box-shadow-small',
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
			<span style={{ display: loading ? 'none' : 'initial', font: 'inherit' }}>
				{children}
			</span>
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
}

export default Button
