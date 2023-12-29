import { createTRPCContext } from './trpc'
import { appRouter } from './root'
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import http from 'http'
import next from 'next'
import { parse } from 'url'
import { Server } from 'ws'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

void app.prepare().then(() => {
	const server = http.createServer((req, res) => {
		const proto = req.headers['x-forwarded-proto']

		if (proto === 'http') {
			// redirect to ssl
			res.writeHead(303, {
				location: `https://${req.headers.host ?? ''}${
					(req.headers.url as string | undefined) ?? ''
				}`,
			})
			res.end()
			return
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const parsedUrl = parse(req.url!, true)
		void handle(req, res, parsedUrl)
	})
	const wss = new Server({ server })
	const handler = applyWSSHandler({
		wss,
		router: appRouter,
		createContext: createTRPCContext,
	})

	process.on('SIGTERM', () => {
		console.log('SIGTERM')
		handler.broadcastReconnectNotification()
	})
	server.listen(port)

	console.log(
		`> Server listening at http://${process.env.HOST ?? ''} as ${
			dev ? 'development' : process.env.NODE_ENV
		}`
	)
})
