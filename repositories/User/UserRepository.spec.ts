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
		const user: Required<User> = {
			id: 'real-id-001',
			name: 'John Doe',
			email: 'arealemail@gmail.com',
			avatarUrl: 'https://arealurl.com',
			googleAssociated: false,
			password: 'A great password',
			onlineStatus: true,
		}

		mockCtx.prisma.user.create.mockResolvedValue(user)

		await expect(repository.create(user)).resolves.toEqual<User>(user)
	})

	it('should find a user by their id', async () => {
		const id = 'user-id-00001'

		const user: Required<User> = {
			id,
			name: 'John Doe',
			email: 'arealemail@gmail.com',
			avatarUrl: 'https://arealurl.com',
			googleAssociated: false,
			password: 'A great password',
			onlineStatus: true,
		}

		mockCtx.prisma.user.findUnique.mockResolvedValue(user)

		await expect(repository.findById(id)).resolves.toEqual<User>(user)
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
		const user: Required<User> = {
			id: 'real-id-001',
			name: 'John Doe',
			email,
			avatarUrl: 'https://arealurl.com',
			googleAssociated: false,
			password: 'A great password',
			onlineStatus: true,
		}

		mockCtx.prisma.user.findUnique.mockResolvedValue(user)

		await expect(repository.findByEmail(email)).resolves.toEqual(user)
	})

	it('should find a user by their google email', async () => {
		const email = 'anormalemail@gmail.com'
		const user: Required<User> = {
			id: 'real-id-001',
			name: 'John Doe',
			email,
			avatarUrl: 'https://arealurl.com',
			googleAssociated: false,
			password: 'A great password',
			onlineStatus: true,
		}

		mockCtx.prisma.user.findFirst.mockResolvedValue(user)

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

	it("should list all of a user's contacts", async () => {
		const id = 'a-real-id'
		const contacts = [
			{ name: 'John Doe' },
			{ name: 'Jon Johnz' },
			{ name: 'Joy' },
		]

		const user: Required<User> & { contacts: any[] } = {
			id,
			name: 'John Doe',
			email: 'areal@email.com',
			avatarUrl: 'https://arealurl.com',
			googleAssociated: false,
			password: 'A great password',
			onlineStatus: true,
			contacts,
		}

		mockCtx.prisma.user.findUnique.mockResolvedValue(user)

		await expect(repository.listUserContacts(id)).resolves.toEqual(contacts)
	})

	it("should fail to list an inexistent user's contacts", async () => {
		const id = 'a-fake-id'

		mockCtx.prisma.user.findUnique.mockResolvedValue(null)

		await expect(repository.listUserContacts(id)).rejects.toThrowError(
			new NotFoundError('User')
		)
	})

	it("should add to a user's contacts", async () => {
		const id = 'a-real-id'

		const user: Required<User> = {
			id,
			name: 'John Doe',
			email: 'areal@email.com',
			avatarUrl: 'https://arealurl.com',
			googleAssociated: false,
			password: 'A great password',
			onlineStatus: true,
		}

		mockCtx.prisma.user.update.mockResolvedValue(user)

		await expect(repository.addToContacts(id, 'anotherId')).resolves.toEqual(
			user
		)
	})

	it("should fail to add to an inexistent user's contacts", async () => {
		const id = 'a-fake-id'

		mockCtx.prisma.user.update.mockRejectedValue(null)

		await expect(
			repository.addToContacts(id, 'anotherId')
		).rejects.toThrowError(new NotFoundError('User'))
	})
})
