import Message from 'entities/Message'
import IPublicUserData from './IPublicUserData'

export default interface IContact extends IPublicUserData {
	lastMessage: Message
}
