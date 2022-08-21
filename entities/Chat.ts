import { ChatType } from '@prisma/client'
import { randomUUID } from 'crypto'
import IPublicUserData from 'interfaces/IPublicUserData'
import Message from './Message'

export default class Chat {
	public id = randomUUID()
	public createdAt = new Date()
	public users?:
		| ({ id: string } & Partial<IPublicUserData>)[]
		| null
		| undefined
	public messages?: ({ id: string } & Partial<Message>)[] | null | undefined
	public userIds?: string[]
	public messageIds?: string[]
	public thumbnailUrl: string | null

	public constructor(
		chatType: typeof ChatType.PrivateChat,
		name: null,
		userIds: [string, string],
		thumbnailUrl?: null,
		messageIds?: string[]
	)
	public constructor(
		chatType: typeof ChatType.GroupChat,
		name: string,
		userIds: string[],
		thumbnailUrl: string,
		messageIds?: string[]
	)
	public constructor(
		public chatType: ChatType,
		public name: string | null = null,
		userIds: string[] = [],
		thumbnailUrl: string | null = null,
		messageIds: string[] = []
	) {
		this.userIds = userIds
		this.messageIds = messageIds
		this.thumbnailUrl = thumbnailUrl
	}
}
