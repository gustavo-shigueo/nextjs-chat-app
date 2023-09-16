export interface IEmailService {
	sendConfirmation(email: string, name: string, link: string): Promise<void>
	sendPasswordReset(email: string, name: string, link: string): Promise<void>
}
