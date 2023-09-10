import { useEffect, useRef, type Dispatch } from 'react'
import Dialog from '../Dialog'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

interface AuthFormsDialogProps {
	form: 'login' | 'signup' | undefined
	setForm: Dispatch<React.SetStateAction<'login' | 'signup' | undefined>>
}

const TRANSITION_DURATION = 300

export default function AuthFormsDialog({
	form,
	setForm,
}: AuthFormsDialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null)

	useEffect(() => {
		if (!form) return dialogRef.current?.close()

		if (dialogRef.current?.open) return
		dialogRef.current?.showModal()
	}, [form])

	return (
		<Dialog
			title=""
			className="grid grid-rows-[auto_1fr] [&_>_section]:flex [&_>_section]:transition-all [&_>_section]:!pbe-0 [&_>_section_>_div]:grid [&_>_section_>_div]:flex-shrink-0 [&_>_section_>_div]:transition-[opacity,translate,grid-template-rows] [&_>_section_>_div]:is-full motion-reduce:[&_>_section_>_div]:transition-opacity [&_form_>_:last-child]:mbe-5"
			onClose={() => setForm(undefined)}
			ref={dialogRef}
		>
			<LoginForm
				inert={form !== 'login'}
				setForm={setForm}
				transitionDuration={TRANSITION_DURATION}
			/>
			<SignupForm
				inert={form !== 'signup'}
				setForm={setForm}
				transitionDuration={TRANSITION_DURATION}
			/>
		</Dialog>
	)
}
