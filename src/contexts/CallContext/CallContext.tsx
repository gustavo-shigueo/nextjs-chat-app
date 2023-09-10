import {
	type ReactNode,
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	useRef,
} from 'react'
import { IoCall } from 'react-icons/io5'
import Peer, { type SignalData } from 'simple-peer'
import Button from '../../components/Button'
import { type CallSchema } from '../../server/api/schemas/callSchema'
import { api } from '../../utils/api'
import VideoCall from '../../components/VideoCall'
import AudioCall from '../../components/AudioCall'
import useRefState from 'src/hooks/useRefState'
import useEventListener from '../../hooks/useEventListener'
import { useChats } from '../ChatContext'
import { MdCallEnd } from 'react-icons/md'

type CallProviderProps = {
	children: ReactNode
}

type CallType = 'Audio' | 'Video'

type CallContextData = {
	startCall: (chatId: string, callType: CallType) => Promise<void>
	pickupCall: () => Promise<void>
	hangupCall: () => Promise<void>
	toggleVideo: () => Promise<void>
	toggleAudio: () => void
	callState: CallState
	peers: Record<string, Peer.Instance>
	myStream: MediaStream | undefined
	isVideoEnabled: boolean
	isAudioEnabled: boolean
}

const CallContext = createContext<CallContextData>({
	startCall() {
		return Promise.resolve()
	},
	pickupCall() {
		return Promise.resolve()
	},
	hangupCall() {
		return Promise.resolve()
	},
	toggleVideo() {
		return Promise.resolve()
	},
	toggleAudio() {
		return undefined
	},
	callState: ['idle', null],
	peers: {},
	myStream: undefined,
	isVideoEnabled: false,
	isAudioEnabled: false,
})

export const useCall = () => useContext(CallContext)

type CallState =
	| ['idle', null]
	| ['receiving' | 'calling' | 'active', CallSchema]

export function CallProvider({ children }: CallProviderProps) {
	const { chats } = useChats()
	const [isVideoEnabled, setIsVideoEnabled] = useState(false)
	const [isAudioEnabled, setIsAudioEnabled] = useState(false)
	const [callState, setCallState] = useState<CallState>(['idle', null])
	const [rejectionCount, setRejectionCount] = useState<number>(0)
	const timeoutRef = useRef(0)

	const [streamState, streamRef, setStream] = useRefState<MediaStream>()
	const [peersState, peersRef, setPeers] = useRefState<
		Record<string, Peer.Instance>
	>({})

	const createCall = api.calls.start.useMutation()
	const joinCall = api.calls.join.useMutation()
	const leaveCall = api.calls.leave.useMutation()
	const rejectCall = api.calls.reject.useMutation()

	const sendOffer = api.calls.sendOffer.useMutation()
	const sendAnswer = api.calls.sendAnswer.useMutation()

	async function startCall(chatId: string, callType: CallType) {
		if (callState[0] !== 'idle') {
			return
		}

		try {
			const myStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: callType === 'Video',
			})

			setStream(myStream)
			setIsAudioEnabled(true)
			setIsVideoEnabled(callType === 'Video')

			const call = await createCall.mutateAsync({ chatId, callType })
			setCallState(['calling', call])
		} catch (e) {
			console.error(e)
		}
	}

	async function pickupCall() {
		if (callState[0] !== 'receiving') {
			return
		}

		try {
			const myStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: callState[1].callType === 'Video',
			})

			setStream(myStream)
			setIsAudioEnabled(true)
			setIsVideoEnabled(callState[1].callType === 'Video')

			const call = await joinCall.mutateAsync({ callId: callState[1].id })
			setCallState(['active', call])
		} catch (e) {
			console.error(e)
		}
	}

	const hangupCall = useCallback(async () => {
		if (callState[0] !== 'active') return

		await leaveCall.mutateAsync({ callId: callState[1].id })

		streamState?.getTracks().forEach(x => x.stop())
		setCallState(['idle', null])
		setStream(undefined)
		setIsAudioEnabled(false)
		setIsVideoEnabled(false)
	}, [callState, leaveCall, setStream, streamState])

	const reject = useCallback(async () => {
		if (callState[0] !== 'receiving') {
			return
		}

		await rejectCall.mutateAsync({ callerId: callState[1].callerId })
		setCallState(['idle', null])
	}, [callState, rejectCall])

	function toggleAudio() {
		if (!streamRef.current) {
			return
		}

		streamRef.current.getAudioTracks().forEach(track => {
			track.enabled = !isAudioEnabled
		})

		setIsAudioEnabled(prev => !prev)
	}

	async function toggleVideo() {
		if (!streamRef.current) {
			return
		}

		if (isVideoEnabled) {
			streamRef.current.getVideoTracks().forEach(track => track.stop())
		} else {
			await enableVideo()
		}

		setIsVideoEnabled(prev => !prev)
	}

	async function enableVideo() {
		if (!streamRef.current) {
			return
		}

		const stream = await navigator.mediaDevices.getUserMedia({ video: true })
		const [oldTrack] = streamRef.current.getVideoTracks()
		const [newTrack] = stream.getVideoTracks()

		if (newTrack && oldTrack) {
			streamRef.current.addTrack(newTrack)
			for (const peer of Object.values(peersState)) {
				peer.replaceTrack(oldTrack, newTrack, streamRef.current)
			}

			streamRef.current.removeTrack(oldTrack)
		}
	}

	api.calls.receive.useSubscription(undefined, {
		onData(call) {
			setCallState(prev => (prev[0] === 'idle' ? ['receiving', call] : prev))
		},
	})

	api.calls.userJoined.useSubscription(undefined, {
		onData(data) {
			const peer = new Peer({
				initiator: true,
				trickle: false,
				stream: streamRef.current,
			})

			peer.on('stream', stream => {
				const element = document.querySelector(
					`[id="${data.userId}"]` as 'video' | 'audio'
				)
				if (element) element.srcObject = stream
			})

			peer.on('signal', signal => {
				void sendOffer.mutateAsync({ to: data.userId, offer: signal })
			})

			setPeers(peers => ({ ...peers, [data.userId]: peer }))
			setCallState(['active', data.call])
		},
	})

	api.calls.receiveRtcOffer.useSubscription(undefined, {
		onData(data) {
			const peer = new Peer({
				initiator: false,
				trickle: false,
				stream: streamRef.current,
			})

			peer.on('stream', stream => {
				const element = document.querySelector(
					`[id="${data.from}"]` as 'video' | 'audio'
				)
				if (element) element.srcObject = stream
			})

			peer.on('signal', signal => {
				void sendAnswer.mutateAsync({ to: data.from, answer: signal })
			})

			peer.on('data', console.log)
			peer.on('connect', () => console.log('CONNECT'))

			peer.signal(data.offer as SignalData)

			setPeers(peers => ({ ...peers, [data.from]: peer }))
		},
	})

	api.calls.receiveRtcAnswer.useSubscription(undefined, {
		onData(data) {
			const peer = peersRef.current[data.from]

			peer?.signal(data.answer as SignalData)
		},
	})

	api.calls.userLeft.useSubscription(undefined, {
		async onData(data) {
			const peer = peersRef.current[data.userId]

			peer?.destroy()

			setPeers(({ [data.userId]: _, ...peers }) => peers)

			if (data.call.participants?.length === 1) {
				await leaveCall.mutateAsync({ callId: data.call.id })
				streamRef.current?.getTracks().forEach(x => x.stop())
				setCallState(['idle', null])
				setStream(undefined)
			} else {
				setCallState(['active', data.call])
			}
		},
	})

	api.calls.userRejected.useSubscription(undefined, {
		onData() {
			setRejectionCount(count => count + 1)
		},
	})

	useEffect(() => {
		if (callState[0] !== 'calling') {
			setRejectionCount(0)
		}
	}, [callState])

	useEffect(() => {
		if (callState[0] !== 'calling') {
			return
		}

		const chat = chats.find(c => c.id === callState[1].chatId)

		if (!chat) {
			return
		}

		if (rejectionCount >= chat.users.length - 1) {
			void leaveCall.mutateAsync({ callId: callState[1].id })

			streamState?.getTracks().forEach(x => x.stop())
			setCallState(['idle', null])
			setStream(undefined)
			setIsAudioEnabled(false)
			setIsVideoEnabled(false)
		}
	}, [callState, chats, leaveCall, rejectionCount, setStream, streamState])

	useEffect(() => {
		window.clearTimeout(timeoutRef.current)
		timeoutRef.current = 0

		switch (callState[0]) {
			case 'calling':
				timeoutRef.current = window.setTimeout(() => {
					window.clearTimeout(timeoutRef.current)
					timeoutRef.current = 0

					void leaveCall.mutateAsync({ callId: callState[1].id })

					streamState?.getTracks().forEach(x => x.stop())
					setCallState(['idle', null])
					setStream(undefined)
					setIsAudioEnabled(false)
					setIsVideoEnabled(false)
				}, 30_000)
				break

			case 'receiving':
				timeoutRef.current = window.setTimeout(() => {
					void reject()
					window.clearTimeout(timeoutRef.current)
					timeoutRef.current = 0
				}, 15_000)
				break
		}
	}, [callState, leaveCall, reject, setStream, streamState])

	useEventListener('beforeunload', () => void hangupCall())

	return (
		<CallContext.Provider
			value={{
				startCall,
				pickupCall,
				hangupCall,
				toggleVideo,
				toggleAudio,
				callState,
				peers: peersState,
				myStream: streamState,
				isVideoEnabled,
				isAudioEnabled,
			}}
		>
			{children}
			{callState[0] === 'receiving' && (
				<div className="fixed inset-0 z-50 grid grid-cols-2 place-items-center bg-neutral-900/70 pli-[max(1em,_15dvw)]">
					<h2 className="col-span-full text-center text-3xl font-bold">
						Recebendo chamada de{' '}
						{callState[1].callType === 'Video' ? 'vídeo' : 'voz'} de{' '}
						{chats.find(c => c.id === callState[1].chatId)?.name ?? ''}
					</h2>

					<Button
						onClick={() => void reject()}
						className="justify-self-start rounded-full text-4xl"
						variant="danger"
					>
						<MdCallEnd />
					</Button>

					<Button
						onClick={() => void pickupCall()}
						className="justify-self-end rounded-full text-4xl"
					>
						<IoCall />
					</Button>
				</div>
			)}

			{callState[0] === 'active' ? (
				callState[1].callType === 'Video' ? (
					<VideoCall />
				) : (
					<AudioCall />
				)
			) : null}
		</CallContext.Provider>
	)
}
