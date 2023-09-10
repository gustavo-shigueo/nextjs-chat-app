import { useRef, type VideoHTMLAttributes, forwardRef } from 'react'

type VideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, 'ref'> & {
	id: string
}

const Video = forwardRef<HTMLVideoElement, VideoProps>(
	({ ...props }: VideoProps, ref) => {
		const localRef = useRef<HTMLVideoElement | null>(null)

		return (
			<div className="aspect-video self-center">
				<video
					className="block aspect-video object-cover bs-full max-bs-full is-full max-is-full"
					autoPlay
					playsInline
					ref={node => {
						localRef.current = node

						if (typeof ref === 'function') ref(node)
						else if (ref) ref.current = node
					}}
					{...props}
				/>
			</div>
		)
	}
)

Video.displayName = 'Video'

export default Video
