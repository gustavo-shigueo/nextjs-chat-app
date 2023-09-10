import type { Call } from '../schema'

export default interface ICallRepository {
	create(
		callerId: Buffer,
		chatId: Buffer,
		callType: 'Audio' | 'Video'
	): Promise<Call>
	end(callId: Buffer): Promise<Call>

	userJoin(callId: Buffer, userId: Buffer): Promise<Call>
	userLeave(callId: Buffer, userId: Buffer): Promise<Call>
}
