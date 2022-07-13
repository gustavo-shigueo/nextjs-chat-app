import Button from 'components/Button'
import Submenu from 'components/Submenu'
import SubmenuItem from 'components/SubmenuItem'
import Image from 'next/image'
import Avatar from './Avatar'
import { ComponentStory, ComponentMeta } from '@storybook/react'

export const AvatarComponent: ComponentStory<typeof Avatar> = () => (
	<Avatar
		logout={async () => {}}
		user={{
			id: 'real-uuid',
			name: 'John Doe',
			email: 'testing@test.com',
			avatarUrl:
				'https://avatars.dicebear.com/api/bottts/TESTE-172c9347-2c6f-4a4e-9cd3-f3a080c750f2.svg',
			onlineStatus: true,
			googleId: 'shoreig',
			emailVerified: true,
		}}
	/>
)

export default {
	title: 'Avatar',
	component: Avatar,
	subcomponents: {
		Button,
		Submenu,
		SubmenuItem,
		Image,
	},
} as ComponentMeta<typeof Avatar>
