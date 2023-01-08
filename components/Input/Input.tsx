import { InputHTMLAttributes, useId, useState } from 'react'
import { DeepMap, FieldError, Path, UseFormRegister } from 'react-hook-form'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import classNames from 'utils/classNames'

export interface InputProps<T extends Record<string, unknown>>
	extends InputHTMLAttributes<HTMLInputElement> {
	name: Path<T>
	label: string
	controlSize?: 'small' | 'medium' | 'large' | 'full'
	register: UseFormRegister<T>
	errors?: Partial<DeepMap<T, FieldError>>
	type:
		| 'date'
		| 'datetime-local'
		| 'email'
		| 'month'
		| 'number'
		| 'password'
		| 'search'
		| 'text'
		| 'time'
		| 'url'
		| 'week'
}

const Input = <T extends Record<string, unknown>>({
	name,
	label,
	type,
	errors,
	controlSize,
	className,
	register,
	onBlur,
	required,
	...props
}: InputProps<T>) => {
	const id = useId()
	const [inputType, setInputType] = useState(type)
	const [dirty, setDirty] = useState(false)

	const errorMessage = errors?.[name]
	const invalid = !!errorMessage
	const control = register(name, {
		onBlur: e => {
			onBlur?.(e)
			setDirty(true)
		},
	})

	return (
		<div
			className={classNames('control')}
			data-control-type="text"
			data-control-size={controlSize}
		>
			<label htmlFor={`${id}-${name}`}>{label}:</label>
			<input
				{...props}
				id={`${id}-${name}`}
				type={inputType}
				data-dirty={dirty}
				aria-invalid={invalid ? 'true' : 'false'}
				className={classNames(className, { invalid: invalid })}
				required={required}
				{...control}
			/>
			{type === 'password' && (
				<button
					type="button"
					className="icon"
					onClick={() => {
						setInputType(t => (t === 'password' ? 'text' : 'password'))
					}}
				>
					{inputType === 'password' ? <IoEye /> : <IoEyeOff />}
				</button>
			)}
			<span className="error-message" role="alert">
				{errorMessage?.message}
			</span>
		</div>
	)
}

export default Input
