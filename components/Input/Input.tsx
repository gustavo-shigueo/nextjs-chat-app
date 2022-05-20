import { FC, InputHTMLAttributes, useEffect, useState } from 'react'
import classNames from 'utils/classNames'
import style from './Input.module.scss'

export type InputValidator = (value: string) => [boolean, string]

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string
	validator?: InputValidator
	serverValid: boolean
	serverErrorMessage?: string
}

const Input: FC<InputProps> = ({
	type,
	name,
	label,
	className,
	autoComplete = 'off',
	validator = () => [true, ''],
	serverErrorMessage = '',
	serverValid,
	...props
}) => {
	const [value, setValue] = useState('')
	const [isClientValid, setIsClientValid] = useState(true)
	const [isServerValid, setIsServerValid] = useState(true)
	const [error, setError] = useState('')
	const accentColor: any = { '--accent-color': 'red', '--text-color': 'red' }

	useEffect(() => {
		if (!value.length) return setIsClientValid(true)
		setIsServerValid(true)

		const [valid, errorMessage] = validator(value)
		setIsClientValid(valid)

		setError(errorMessage)
	}, [value, validator])

	useEffect(() => {
		setIsServerValid(serverValid)
		setError(serverErrorMessage)
	}, [serverErrorMessage, serverValid])

	return (
		<div
			className={classNames(style.inputControl, className)}
			style={!isClientValid || !isServerValid ? accentColor : undefined}
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
			{!(isClientValid && isServerValid) && (
				<span className={style.error}>{error}</span>
			)}
		</div>
	)
}

export default Input
