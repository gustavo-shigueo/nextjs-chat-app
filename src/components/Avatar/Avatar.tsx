import Image from 'next/image'
import { type FC } from 'react'

interface AvatarProps {
	name: string
	imageUrl: string
	moreInfo?: string
}

const Avatar: FC<AvatarProps> = ({ name, imageUrl, moreInfo }) => (
	<span className="flex items-center em:gap-2">
		<Image
			src={imageUrl}
			width={32}
			height={32}
			className="rounded-full"
			alt={`${name}'s avatar`}
		/>
		<div className="grid">
			<p>{name}</p>
			{moreInfo && (
				<small className="text-neutral-700 dark:text-neutral-400">
					{moreInfo}
				</small>
			)}
		</div>
	</span>
)

export default Avatar
