import Dialog from 'components/Dialog'
import LoginForm from 'components/LoginForm'
import SignupForm from 'components/SignupForm'
import { useAuth } from 'contexts/UserContext'
import React, { Dispatch, FC, useCallback, useEffect, useRef } from 'react'
import styles from './AuthFormsDialog.module.scss'

interface AuthFormsDialogProps {
	form: 'login' | 'signup' | undefined
	setForm: Dispatch<React.SetStateAction<'login' | 'signup' | undefined>>
}

const AuthFormsDialog: FC<AuthFormsDialogProps> = ({ form, setForm }) => {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const loginRef = useRef<HTMLDivElement>(null)
	const signupRef = useRef<HTMLDivElement>(null)
	const { isAuthenticated } = useAuth()

	useEffect(() => {
		if (isAuthenticated) setForm(undefined)
	}, [isAuthenticated, setForm, form])

	const setBlockSize = useCallback(() => {
		if (!form || !dialogRef.current?.open) return

		const ref = form === 'login' ? loginRef : signupRef

		if (!ref.current?.parentElement) return

		const wrapper = ref.current.parentElement
		const { paddingBlockEnd } = getComputedStyle(wrapper)
		const headerSize = dialogRef.current.children[0].clientHeight

		const content = [...ref.current.children]
		const blockSizes = content.map(e => getComputedStyle(e).blockSize)
		const sizes = blockSizes.map(b => parseInt(b.replace('px', '')))
		const contentSize = sizes.reduce((acc, cur) => acc + cur, 0)

		const targetSize = `${contentSize}px + ${paddingBlockEnd} + 2 * var(--size-300) + 0.5px`
		const maxSize = `90vb - ${headerSize}px`

		wrapper.style.blockSize = `min(${targetSize}, ${maxSize})`
	}, [form])

	useEffect(() => {
		if (!form) return dialogRef.current?.close()

		if (dialogRef.current?.open) return
		dialogRef.current?.showModal()
	}, [form])

	useEffect(setBlockSize, [form, setBlockSize])

	useEffect(() => {
		if (!form || !dialogRef.current?.open) return

		const observer = new ResizeObserver(setBlockSize)
		observer.observe(document.body)

		const ref = form === 'login' ? loginRef : signupRef
		if (ref.current) {
			;[...ref.current.children].forEach(e => observer.observe(e))
		}

		return () => observer.disconnect()
	}, [form, setBlockSize])

	return (
		<Dialog
			title=""
			className={styles.authDialog}
			style={{ maxInlineSize: '50ch' }}
			onClose={() => setForm(undefined)}
			ref={dialogRef}
		>
			<LoginForm ref={loginRef} inert={form !== 'login'} setForm={setForm} />
			<SignupForm ref={signupRef} inert={form !== 'signup'} setForm={setForm} />
		</Dialog>
	)
}

export default AuthFormsDialog
