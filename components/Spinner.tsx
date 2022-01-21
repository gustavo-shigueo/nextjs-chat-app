import { FC, HTMLAttributes } from 'react'
import style from 'styles/Spinner.module.css'

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
	size?: number
}

const Spinner: FC<SpinnerProps> = ({
	size = 1,
	style: HTMLStyle,
	...props
}) => {
	return (
		<div
			className={style.spinner}
			style={{ width: `${size}rem`, ...HTMLStyle }}
			{...props}
		/>
	)
}

export default Spinner
