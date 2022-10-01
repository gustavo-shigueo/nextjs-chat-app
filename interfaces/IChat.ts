import Chat from 'entities/Chat'

type IChat = Omit<Chat, 'messageIds' | 'userIds'>

export default IChat
