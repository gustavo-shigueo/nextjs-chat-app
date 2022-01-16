import { ButtonHTMLAttributes, FC } from 'react'
import style from 'styles/Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	text: string
	variant?:
		| 'primary'
		| 'secondary'
		| 'outline'
		| 'danger'
		| 'warning'
		| 'success'
}

const Button: FC<ButtonProps> = ({
	text,
	type = 'button',
	variant = 'primary',
	onClick,
	...props
}) => {
	return (
		<button
			// className={`btn btn-${variant}`}
			className={`${style.btn} ${style[`btn-${variant}`]}`}
			type={type}
			onClick={onClick}
			{...props}
		>
			{text}
		</button>
	)
}

export default Button
