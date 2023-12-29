import { forwardRef, type FormHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

const Form = forwardRef<HTMLFormElement, FormHTMLAttributes<HTMLFormElement>>(
	({ children, className, onSubmit, ...props }, ref) => (
		<form
			onSubmit={onSubmit}
			ref={ref}
			className={twMerge('grid @container em:gap-2', className)}
			{...props}
		>
			{children}
		</form>
	)
)
Form.displayName = 'Form'

export default Form
