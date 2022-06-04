import MessageRepository from 'repositories/Message'
import MessageService from './MessageService'

export default new MessageService(MessageRepository)
