import { applyWSSHandler } from '@trpc/server/adapters/ws'
import { createServer } from 'http'
import { Server } from 'ws'
import { appRouter } from './root'
import { createTRPCContext } from './trpc'

const httpServer = createServer(() => null)
const wsServer = new Server({ server: httpServer })

const handler = applyWSSHandler({
	wss: wsServer,
	router: appRouter,
	createContext: createTRPCContext,
})

wsServer.on('connection', ws => {
	console.warn(`Connection ${wsServer.clients.size}`)
	ws.once('close', () => {
		console.warn(`Disconnected ${wsServer.clients.size}`)
	})
})

process.on('SIGTERM', () => {
	handler.broadcastReconnectNotification()
	wsServer.close()
})

httpServer.listen(process.env.PORT)
