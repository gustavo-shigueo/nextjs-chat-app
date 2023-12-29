import type { JoinedChat } from '../schema'

export default interface IChatRepository {
	findById(id: Buffer): Promise<JoinedChat>

	findByParticipantId(userId: Buffer): Promise<JoinedChat[]>

	createPrivateChat(creator: Buffer, contact: Buffer): Promise<JoinedChat>

	createGroupChat(
		name: string,
		creator: Buffer,
		users: readonly Buffer[]
	): Promise<JoinedChat>

	addUser(id: Buffer, userId: Buffer): Promise<JoinedChat>
}
