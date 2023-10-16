import { forwardRef, useId, useRef, type HTMLAttributes } from 'react'
import { IoChevronDown } from 'react-icons/io5'
import { twMerge } from 'tailwind-merge'
import useCollapsable from '../../hooks/useCollapsable'
import Button from '../Button'

type TriggerProps = {
	isCollapsed: boolean
}

type CollapsableMenuProps = HTMLAttributes<HTMLDivElement> & {
	trigger?: (props: TriggerProps) => JSX.Element | null
}

const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ children, className: cn, role, ...props }, ref) => {
		const className = twMerge('relative z-[20] bg-inherit', cn)

		if (role === 'navigation') {
			return (
				<nav className={className} ref={ref} {...props}>
					{children}
				</nav>
			)
		}

		return (
			<div role={role} className={className} ref={ref} {...props}>
				{children}
			</div>
		)
	}
)

Container.displayName = 'Container'

function DefaultTrigger({ isCollapsed }: { isCollapsed: boolean }) {
	return <IoChevronDown style={{ rotate: isCollapsed ? '0deg' : '180deg' }} />
}

function CollapsableMenu({
	role,
	trigger: Trigger,
	children,
	...props
}: CollapsableMenuProps) {
	const id = useId()
	const ref = useRef<HTMLDivElement>(null)
	const isCollapsed = useCollapsable(ref)

	return (
		<Container role={role} ref={ref} {...props}>
			<Button
				variant="flat"
				data-trigger
				className="aria-expanded:[&_+_ul]:tranlate-y-[100%] text-inherit aria-expanded:[&_+_ul]:opacity-100"
				aria-controls={id}
				aria-expanded={!isCollapsed}
			>
				{Trigger ? (
					<Trigger isCollapsed={isCollapsed} />
				) : (
					<DefaultTrigger isCollapsed={isCollapsed} />
				)}
			</Button>

			<ul
				id={id}
				inert={isCollapsed ? 'true' : undefined}
				style={{
					translate: isCollapsed ? '0 -100%' : undefined,
					boxShadow: isCollapsed ? 'none' : undefined,
				}}
				className="absolute z-[1] translate-y-[-100%] list-none border-2 border-neutral-100/25 bg-inherit font-bold opacity-0 shadow-xl min-is-[11.25em] block-end-0 inline-end-0 em:rounded motion-safe:transition-[opacity,transform] [[aria-expanded=true]_+_&]:translate-y-[110%] [[aria-expanded=true]_+_&]:opacity-100"
			>
				{children}
			</ul>
		</Container>
	)
}

export default CollapsableMenu
