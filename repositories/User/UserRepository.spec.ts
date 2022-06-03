import IUserRepository from './IUserRepository'
import { MockContext, Context, createMockContext } from 'prisma/testing.context'
import PrismaUserRepository from './PrismaUserRepository'
import User from 'entities/User'
import NotFoundError from 'errors/NotFoundError'

describe('User Repository', () => {
	let mockCtx: MockContext
	let ctx: Context
	let repository: IUserRepository

	beforeEach(() => {
		mockCtx = createMockContext()
		ctx = mockCtx as unknown as Context
		repository = new PrismaUserRepository(ctx.prisma)
	})

	it('should create new user ', async () => {
		const user: any = new User(
			'John Doe',
			'arealemail@gmail.com',
			'A great password',
			'https://arealurl.com'
		)

		mockCtx.prisma.user.create.mockResolvedValue(user)

		await expect(repository.create(user)).resolves.toEqual<User>({
			id: undefined,
			name: 'John Doe',
			email: 'arealemail@gmail.com',
			avatarUrl: 'https://arealurl.com',
			googleAssociated: false,
			password: 'A great password',
			onlineStatus: true,
			contacts: undefined,
			messagesSent: undefined,
			messagesReceived: undefined,
		})
	})

	it('should find a user by their id', async () => {
		let user = new User(
			'John Doe',
			'arealemail@gmail.com',
			'A great password',
			'https://arealurl.com'
		)

		const id = 'user-id-00001'
		user = { ...user, id }

		mockCtx.prisma.user.findUnique.mockResolvedValue(user as any)

		await expect(repository.findById(id)).resolves.toEqual<User>({
			id,
			name: 'John Doe',
			email: 'arealemail@gmail.com',
			avatarUrl: 'https://arealurl.com',
			googleAssociated: false,
			password: 'A great password',
			onlineStatus: true,
			contacts: undefined,
			messagesSent: undefined,
			messagesReceived: undefined,
		})
	})

	it('should fail to find a user with inexistent information', async () => {
		const id = 'fake-id-101'
		const email = 'fake-email@gmail.com'

		mockCtx.prisma.user.findUnique.mockResolvedValue(null)
		mockCtx.prisma.user.findFirst.mockResolvedValue(null)

		await expect(repository.findById(id)).rejects.toThrowError(
			new NotFoundError('User')
		)

		await expect(repository.findByEmail(email)).resolves.toBeNull()
		await expect(
			repository.findByGoogleAssociatedEmail(email)
		).resolves.toBeNull()
	})

	it('should detect whether an email is being used', async () => {
		for (let i = 0; i < 10; i++) {
			mockCtx.prisma.user.count.mockResolvedValue(i)

			await expect(
				repository.isEmailInUse('arealemail@gmail.com')
			).resolves.toBe(i > 0)
		}
	})

	it('should find users with a given substring in their name', async () => {
		const users = [{ name: 'John Doe' }, { name: 'Jon Johnz' }, { name: 'Joy' }]

		mockCtx.prisma.user.findMany.mockResolvedValue(users as any[])

		await expect(repository.findByName('Jo')).resolves.toEqual(users)
	})

	it('should find a user by their email', async () => {
		const email = 'anormalemail@gmail.com'
		const user = { email }

		mockCtx.prisma.user.findUnique.mockResolvedValue(user as any)

		await expect(repository.findByEmail(email)).resolves.toEqual(user)
	})

	it('should find a user by their google email', async () => {
		const email = 'anormalemail@gmail.com'
		const user = { email }

		mockCtx.prisma.user.findFirst.mockResolvedValue(user as any)

		await expect(
			repository.findByGoogleAssociatedEmail(email)
		).resolves.toEqual(user)
	})

	it('should list all users', async () => {
		const users = [{ name: 'John Doe' }, { name: 'Jon Johnz' }, { name: 'Joy' }]

		mockCtx.prisma.user.findMany.mockResolvedValue(users as any[])

		await expect(repository.listAll()).resolves.toEqual(users)
	})

	it('should update a user based on their id', async () => {
		const user = {
			id: 'user-id-1',
			name: 'newName',
		}

		mockCtx.prisma.user.update.mockResolvedValue(user as any)

		await expect(
			repository.updateOne({ name: 'newName' }, { id: 'user-id-1' })
		).resolves.toEqual(user)
	})

	it('should fail to update a user with inexistent information', async () => {
		const id = 'fake-id-101'
		const email = 'fake-email@gmail.com'

		mockCtx.prisma.user.update.mockRejectedValue(null)

		await expect(repository.updateOne({ email }, { id })).rejects.toThrowError(
			new NotFoundError('User')
		)
	})
})
