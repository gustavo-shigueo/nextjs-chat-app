import { type CallSchema } from '../../../server/api/schemas/callSchema'

export default interface ICallService {
	create(
		callerId: string,
		chatId: string,
		callType: 'Audio' | 'Video'
	): Promise<CallSchema>
	end(callId: string): Promise<CallSchema>

	userJoin(callId: string, userId: string): Promise<CallSchema>
	userLeave(callId: string, userId: string): Promise<CallSchema>
}
