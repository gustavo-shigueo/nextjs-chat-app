import PrismaChatRepository from './PrismaChatRepository'
import client from '../../prisma/client'
import initialUsers from '../__mock__/users.json'
import Chat from '../../entities/Chat'
import { ChatType } from '@prisma/client'
import mockData from '../__mock__/chats.json'

const initialData = mockData.map((d: any) => ({
	...d,
	createdAt: new Date(d.createdAt),
})) as typeof mockData

describe('Chat Repository', () => {
	let repository: PrismaChatRepository

	beforeEach(async () => {
		await client.$connect()
		await client.chat.deleteMany()
		await client.user.deleteMany()
		await client.user.createMany({ data: initialUsers })

		const promises = initialData.map(c =>
			client.chat.create({
				data: {
					id: c.id,
					chatType: c.chatType as ChatType,
					name: c.name,
					createdAt: c.createdAt,
					users:
						c.userIds.length > 0
							? {
									connect: c.userIds.map(id => ({ id })),
							  }
							: undefined,
					messages:
						c.messageIds.length > 0
							? {
									connect: c.messageIds.map(id => ({ id })),
							  }
							: undefined,
				},
			})
		)

		await Promise.all(promises)

		repository = new PrismaChatRepository(client)
	})

	afterEach(async () => {
		await client.$disconnect()
	})

	it('Can find a chat by id', async () => {
		const chat = initialData[Math.floor(Math.random() * initialData.length)]

		const found: Chat = await repository.findById(chat.id)

		expect(found.id).toEqual(chat.id)
		expect(found.name).toEqual(chat.name)
		expect(found.createdAt).toEqual(chat.createdAt)
		expect(found.chatType).toEqual(chat.chatType)

		chat.userIds.forEach(id =>
			expect(found.users?.some(f => f.id === id)).toBe(true)
		)

		chat.messageIds.forEach(id =>
			expect(found.messages?.some(f => f.id === id)).toBe(true)
		)
	})

	it("Can get all of a user's chats", async () => {
		const user = initialUsers[2]

		const userChats: Chat[] = await repository.findByParticipantId(user.id)

		const chats = initialData.filter(c => c.userIds.includes(user.id))

		expect(userChats.length).toBe(5)
		expect(userChats.every(c => c.users?.some(u => u.id === user.id))).toBe(
			true
		)
		chats.forEach(c => expect(userChats.some(uC => uC.id === c.id)).toBe(true))
	})

	it('Can create a chat between two users', async () => {
		const [, , , userA, , , userB] = initialUsers

		const chat = new Chat(ChatType.PrivateChat, null, [userA.id, userB.id])

		const created: Chat = await repository.create(chat)

		expect(created.id).toEqual(chat.id)
		expect(created.name).toEqual(chat.name)
		expect(created.createdAt).toEqual(chat.createdAt)
		expect(created.chatType).toEqual(chat.chatType)

		chat.userIds?.forEach(id =>
			expect(created.users?.some(u => u.id === id)).toBe(true)
		)
		chat.messageIds?.forEach(id =>
			expect(created.messages?.some(m => m.id === id)).toBe(true)
		)
	})

	it('Can create a group chat including many users', async () => {
		const [userA, , userB, userC, , , , userD] = initialUsers

		const chat = new Chat(
			ChatType.GroupChat,
			'Random Group',
			[userA.id, userB.id, userC.id, userD.id],
			'http://thumbnailUrl.com'
		)

		const created: Chat = await repository.create(chat)

		expect(created.id).toEqual(chat.id)
		expect(created.name).toEqual(chat.name)
		expect(created.createdAt).toEqual(chat.createdAt)
		expect(created.chatType).toEqual(chat.chatType)

		chat.userIds?.forEach(id =>
			expect(created.users?.some(u => u.id === id)).toBe(true)
		)

		chat.messageIds?.forEach(id =>
			expect(created.messages?.some(m => m.id === id)).toBe(true)
		)
	})
})
