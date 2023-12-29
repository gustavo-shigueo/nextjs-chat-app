import callRepository from '../../../server/repositories/Call'
import uuidSerializer from '../../../server/serializers/Uuid'
import CallService from './Call'
import type ICallService from './ICall'

const callService: ICallService = new CallService(
	callRepository,
	uuidSerializer
)

export default callService
export { type ICallService }
