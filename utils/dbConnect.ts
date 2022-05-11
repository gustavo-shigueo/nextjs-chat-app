import DatabaseConnectionError from 'errors/DatabaseConnectionError'
import mongoose from 'mongoose'

let connectionState = 0

export default async function dbConnect() {
	try {
		if (connectionState) return

		const db = await mongoose.connect(process.env.DATABASE_URI!)

		connectionState = db.connections[0].readyState
	} catch (e: any) {
		throw new DatabaseConnectionError()
	}
}
