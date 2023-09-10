import { useCall } from '../../contexts/CallContext'
import Button from '../Button'
import { MdCallEnd } from 'react-icons/md'
import { IoMic, IoMicOff } from 'react-icons/io5'
import { useEffect, useState } from 'react'

export default function Controls() {
	const { hangupCall, toggleAudio, isAudioEnabled } = useCall()

	const [time, setTime] = useState(0)

	useEffect(() => {
		const interval = setInterval(() => setTime(prev => prev + 1), 1000)
		return () => {
			clearInterval(interval)
		}
	}, [])

	return (
		<div className="flex gap-4 text-2xl pli-4 plb-2">
			<div className="grid place-items-center border-neutral-50 pie-4 border-ie-2">
				{new Date(time * 1000)
					.toISOString()
					.substring(time < 3600 ? 14 : 11, 19)}
			</div>

			<Button
				outline={!isAudioEnabled}
				className="text-neutral-50 em:rounded-full"
				variant="neutral"
				onClick={() => void toggleAudio()}
			>
				{isAudioEnabled ? <IoMic /> : <IoMicOff />}
			</Button>

			<Button
				variant="danger"
				className="em:rounded-full"
				onClick={() => void hangupCall()}
			>
				<MdCallEnd />
			</Button>
		</div>
	)
}
