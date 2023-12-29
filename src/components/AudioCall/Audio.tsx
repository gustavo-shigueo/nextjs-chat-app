import { type VideoHTMLAttributes, useRef } from 'react'

type AudioProps = VideoHTMLAttributes<HTMLVideoElement> & {
	id: string
}

export default function Audio(props: AudioProps) {
	const ref = useRef<HTMLAudioElement | null>(null)

	return <audio ref={ref} className="hidden" autoPlay {...props} />
}
