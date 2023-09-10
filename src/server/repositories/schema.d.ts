import type {
	Account,
	Call as C,
	CallParticipant,
	Chat,
	ChatType,
	Message,
	User,
	VerificationToken,
} from '@prisma/client'

type Call = C & {
	participants?: CallParticipant[]
}

export type {
	Account,
	Account,
	Call,
	Chat,
	ChatType,
	Message,
	User,
	VerificationToken,
}

export type JoinedChat = Chat & {
	users: User[]
	creator: User
	messages: Message[]
}

export type JoinedAccount = Account & { user: User }
