import { Document } from 'mongoose'
import UserInterface from './UserInterface'

type UserDocumentInterface = UserInterface &
	Document<any, any, UserInterface> & {
		_id?: string
	}

export default UserDocumentInterface
