import { useRef, useState } from 'react'
import { useCall } from '../../contexts/CallContext'
import Audio from './Audio'
import Controls from './Controls'
import { PiDotsSixVerticalBold } from 'react-icons/pi'
import useEventListener from 'src/hooks/useEventListener'

export default function VideoCall() {
	const { peers } = useCall()
	const [coordinates, setCoordinates] = useState({ x: 0, y: 0 })
	const [moving, setMoving] = useState(false)
	const [moved, setMoved] = useState(false)

	const ref = useRef<HTMLDivElement>(null)

	useEventListener('pointercancel', console.log)

	useEventListener('pointermove', e => {
		console.log('a')
		if (!moving || !ref.current) return
		console.log('b')

		const { height, width } = ref.current.getBoundingClientRect()

		setCoordinates(({ x, y }) => ({
			x: Math.min(
				Math.max(x + e.movementX, 10),
				window.innerWidth - width - 10
			),
			y: Math.min(
				Math.max(y + e.movementY, 10),
				window.innerHeight - height - 10
			),
		}))
		setMoved(true)
	})

	useEventListener('pointerup', () => {
		setMoving(false)
		console.log('damn')
		document.body.style.cursor = ''
	})

	return (
		<div
			ref={ref}
			className="fixed z-50 flex touch-none select-none bg-[rgb(15_15_15)] block-start-4 inline-end-4 em:rounded"
			style={
				moved
					? {
							top: `${coordinates.y}px`,
							left: `${coordinates.x}px`,
							insetInlineEnd: 'unset',
					  }
					: undefined
			}
		>
			<div
				onPointerDown={() => {
					if (!ref.current) return

					const { x, y } = ref.current.getBoundingClientRect()

					setMoving(true)
					setCoordinates({ x, y })
					document.body.style.cursor = 'move'
				}}
				className="grid cursor-move touch-none place-items-center text-2xl pis-2"
			>
				<PiDotsSixVerticalBold />
			</div>
			{Object.keys(peers).map(id => (
				<Audio key={id} id={id} />
			))}
			<Controls />
		</div>
	)
}
