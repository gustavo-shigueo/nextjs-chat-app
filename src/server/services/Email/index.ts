import { env } from '../../../env'
import { NodeMailerEmailService } from './NodeMailer'
import type { IEmailService } from './IEmail'
import { createTransport } from 'nodemailer'

const transporter = createTransport({
	service: 'gmail',
	auth: {
		user: env.NODEMAILER_EMAIL,
		pass: env.NODEMAILER_PASSWORD,
	},
})

const emailService: IEmailService = new NodeMailerEmailService(
	env.NODEMAILER_EMAIL,
	transporter
)

export default emailService
export type { IEmailService }
