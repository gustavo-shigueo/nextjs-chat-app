import { useEffect, useRef } from 'react'
import { useCall } from '../../contexts/CallContext'
import Video from './Video'
import Controls from './Controls'

export default function VideoCall() {
	const { myStream, peers } = useCall()
	const ref = useRef<HTMLDivElement>(null)
	const myVideoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		void ref.current
			?.requestFullscreen({ navigationUI: 'hide' })
			.catch(console.error)
	}, [])

	useEffect(() => {
		if (myVideoRef.current) {
			myVideoRef.current.srcObject = myStream ?? null
		}
	}, [myStream])

	return (
		<div
			ref={ref}
			className="fixed inset-0 z-[100] grid auto-cols-[1fr] grid-flow-col auto-rows-[1fr] gap-2 bg-neutral-900 p-2"
		>
			<Video id="me" muted ref={myVideoRef} />
			{Object.keys(peers).map(id => (
				<Video key={id} id={id} />
			))}
			<Controls />
		</div>
	)
}
