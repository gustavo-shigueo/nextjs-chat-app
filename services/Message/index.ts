import MessageRepository from 'repositories/Message'
import ChatService from 'services/Chat'
import MessageService from './MessageService'

export default new MessageService(MessageRepository, ChatService)
