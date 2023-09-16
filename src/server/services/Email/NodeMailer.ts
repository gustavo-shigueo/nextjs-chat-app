import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import type { IEmailService } from './IEmail'
import type { Transporter } from 'nodemailer'

export class NodeMailerEmailService implements IEmailService {
	#from: string
	#transporter: Transporter<SMTPTransport.SentMessageInfo>

	public constructor(
		from: string,
		transporter: Transporter<SMTPTransport.SentMessageInfo>
	) {
		this.#from = from
		this.#transporter = transporter
	}

	public async sendConfirmation(
		email: string,
		name: string,
		link: string
	): Promise<void> {
		await this.#transporter.sendMail({
			to: email,
			from: this.#from,
			subject: 'Confirmação de e-mail',
			html: `
				<h1>Olá ${name}, bem-vindo ao MiChat</h1>

				<p>
					Para fazer login, por favor confirme seu e-mail clicando
					<a href="${link}">neste link</a>
				</p>

				<p><strong>Não se cadastrou?</strong> Basta ignorar este e-mail</p>
			`,
		})
	}

	public async sendPasswordReset(
		email: string,
		name: string,
		link: string
	): Promise<void> {
		await this.#transporter.sendMail({
			to: email,
			from: this.#from,
			subject: 'Redefinição de senha',
			html: `
				<h1>Olá ${name}, você solicitou a redefinição da sua senha</h1>

				<p>
					Para redefinir sua senha, clique <a href="${link}">neste link</a>
				</p>

				<strong>Atenção, não envie este link para ninguém!</strong>

				<p>
					<strong>Não solicitou a redefinição de senha?</strong>
					Basta ignorar este e-mail
				</p>
			`,
		})
	}
}
