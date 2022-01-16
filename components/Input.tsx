import { FC, InputHTMLAttributes, useEffect, useState } from 'react'
import style from 'styles/Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string
	validator?: (value: string) => boolean
	valid: boolean
	errorMessage?: string
}

const Input: FC<InputProps> = ({
	type,
	name,
	label,
	className,
	autoComplete = 'off',
	validator = () => true,
	valid,
	errorMessage = '',
	...props
}) => {
	const [value, setValue] = useState('')
	const [isValid, setIsValid] = useState(true)
	const accentColor: any = { '--accent-color': 'red', '--text-color': 'red' }

	useEffect(() => {
		if (!value.length) return setIsValid(true)

		setIsValid(validator(value))
	}, [value, validator])

	return (
		<div
			className={`${style.inputControl} ${className ?? ''}`}
			style={!isValid || !valid ? accentColor : undefined}
		>
			<input
				id={name}
				type={type ?? 'text'}
				name={name}
				className={style.input}
				placeholder=" "
				autoComplete={autoComplete}
				value={value}
				onChange={e => setValue(e.target.value)}
				{...props}
			/>
			<label className={style.label} htmlFor={name}>
				{label}
			</label>
			{isValid || <span className={style.error}>{errorMessage}</span>}
		</div>
	)
}

export default Input
