import { useCall } from '../../contexts/CallContext'
import Button from '../Button'
import { MdCallEnd } from 'react-icons/md'
import { IoVideocam, IoVideocamOff, IoMic, IoMicOff } from 'react-icons/io5'
import { useEffect, useState } from 'react'

export default function Controls() {
	const {
		hangupCall,
		toggleVideo,
		toggleAudio,
		isVideoEnabled,
		isAudioEnabled,
	} = useCall()

	const [time, setTime] = useState(0)

	useEffect(() => {
		const interval = setInterval(() => setTime(prev => prev + 1), 1000)
		return () => {
			clearInterval(interval)
		}
	}, [])

	return (
		<div className="absolute flex -translate-x-1/2 gap-4 bg-[rgb(15_15_15)] text-2xl plb-2 pli-4 block-end-4 inline-start-1/2 em:rounded">
			<div className="grid place-items-center border-neutral-50 pie-4 border-ie-2">
				{new Date(time * 1000)
					.toISOString()
					.substring(time < 3600 ? 14 : 11, 19)}
			</div>

			<Button
				variant="neutral"
				outline={!isVideoEnabled}
				className="em:rounded-full"
				onClick={() => void toggleVideo()}
			>
				{isVideoEnabled ? <IoVideocam /> : <IoVideocamOff />}
			</Button>

			<Button
				className="em:rounded-full"
				variant="neutral"
				outline={!isAudioEnabled}
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
