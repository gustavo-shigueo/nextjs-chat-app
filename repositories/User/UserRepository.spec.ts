import IUserRepository from './IUserRepository'
import PrismaUserRepository from './PrismaUserRepository'
import User from 'entities/User'
import NotFoundError from 'errors/NotFoundError'
import client from 'prisma/client'
import { randomInt, randomUUID } from 'crypto'

describe('User Repository', () => {
	let repository: InstanceType<typeof PrismaUserRepository>

	beforeEach(async () => {
		await client.user.deleteMany()
		await client.user.createMany({ data: initialUsers })
		repository = new PrismaUserRepository(client)
	})

	it('should create new user ', async () => {
		const newUser = new User(
			"Ra's al Ghul",
			'league-of-assassins@gmail.com',
			null,
			'https:/realulr.com',
			'realgoogleid'
		)

		const result = await repository.create(newUser)

		expect(result).toEqual(newUser)
	})

	it('should find a user by their id', async () => {
		const index = randomInt(0, initialUsers.length)
		const user = initialUsers[index]

		const result = await repository.findById(user.id)

		expect(result).toEqual(user)
	})

	it('should find a user by their email', async () => {
		const index = randomInt(0, initialUsers.length)
		const user = initialUsers[index]

		const result = await repository.findByEmail(user.email)

		expect(result).toEqual(user)
	})

	it('should fail to find a user with inexistent id', async () => {
		const fakeId = "this id shouldn't exist"

		const promise = repository.findById(fakeId)

		expect(promise).rejects.toThrowError(new NotFoundError('User'))
	})

	it('should fail to find a user with inexistent email', async () => {
		const fakeGoogleId = 'not-an-email'

		const result = await repository.findByEmail(fakeGoogleId)

		expect(result).toBeNull()
	})

	it('should fail to find a user with inexistent googleId', async () => {
		const fakeGoogleId = 'this google id is not real'

		const result = await repository.findByGoogleId(fakeGoogleId)

		expect(result).toBeNull()
	})

	it('should find users with a given substring in their name', async () => {
		const nameSubstring = 'Har'

		const results = await repository.findByName(nameSubstring)

		initialUsers
			.filter(({ name }) => name.includes(nameSubstring))
			.forEach(user => expect(results).toContainEqual(user))
	})

	it('should find a user by their google id', async () => {
		const usersWithGoogleId = initialUsers.filter(({ googleId }) => !!googleId)
		const index = randomInt(0, usersWithGoogleId.length)
		const user = usersWithGoogleId[index]

		const result = await repository.findByGoogleId(user.googleId!)

		expect(result).toEqual(user)
	})

	it('should list all users', async () => {
		const users = await repository.listAll()

		const listedAll = initialUsers.every(
			u => !!users.find(user => user.id === u.id)
		)

		expect(listedAll).toBeTruthy()
	})

	it('should be able to update a user', async () => {
		const index = randomInt(0, initialUsers.length)
		const { id, ...user } = initialUsers[index]
		const name = 'New name'

		const result = await repository.updateOne({ name }, { id })

		expect(result).toEqual({ id, ...user, name })
	})

	it('should fail to update a user with inexistent information', async () => {
		const fakeId = randomUUID()

		const promise = repository.updateOne(
			{ name: 'Edward Nigma' },
			{ id: fakeId }
		)

		expect(promise).rejects.toThrowError(new NotFoundError('User'))
	})

	it('should be able to choose a new id for a new user in case of a clash', async () => {
		const [{ id }] = initialUsers

		const newUser: User = {
			id,
			name: 'Slade Wilson',
			avatarUrl: 'https://someurl.com',
			email: 'mercenary@mail.com',
			emailVerified: false,
			googleId: 'real google id',
			onlineStatus: true,
			password: null,
		}

		const { id: newId } = await repository.create(newUser)

		expect(newId).not.toBe(id)
	})

	it('should be able to tell whether an email is in use', async () => {
		const index = randomInt(0, initialUsers.length)
		const { email } = initialUsers[index]

		const truthyResult = await repository.isEmailInUse(email)
		const falsyResult = await repository.isEmailInUse('not-an-email@mail.com')

		expect(truthyResult).toBe(true)
		expect(falsyResult).toBe(false)
	})
})

const initialUsers: User[] = [
	new User(
		'John Doe',
		'johndoe@email.com',
		'secure-and-hashed-password',
		'https://avatar.url'
	),
	new User(
		'Bob Williams',
		'bob@email.com',
		'secure-and-hashed-password',
		'https://avatar.url'
	),
	new User(
		'Alice Adams',
		'aliceadams@email.com',
		'secure-and-hashed-password',
		'https://avatar.url'
	),
	// I cant come up with more fake data, so here are some random Batman characters
	new User(
		'Joe Chill',
		'joechill@email.com',
		null,
		'https://avatar.url',
		'a real google id'
	),
	new User(
		'Pamela Isley',
		'poisonivy@email.com',
		'secure-and-hashed-password',
		'https://avatar.url',
		'another real google id'
	),
	new User(
		'Oswald Cobblepot',
		'penguin@gotham.com',
		'secure-and-hashed-password',
		'https://avatar.url'
	),
	new User(
		'Bruce Wayne',
		'notbatman@email.com',
		'secure-and-hashed-password',
		'https://avatar.url',
		'Wanna know my secret identity?'
	),
	new User(
		'Alfred Pennyworth',
		'worth-more-than-a-penny@email.com',
		'secure-and-hashed-password',
		'https://avatar.url'
	),
	new User(
		'Richard Grayson',
		'iamnotadick@email.com',
		null,
		'https://avatar.url',
		'I am totally not nightwing'
	),
	new User(
		'Damian Wayne',
		'boyblunder@email.com',
		null,
		'https://avatar.url',
		"It's easier my way"
	),
	new User(
		'Bane',
		'back-breaker@email.com',
		null,
		'https://avatar.url',
		'I will break your back, Batman!'
	),
	new User(
		'Harleen Quinzel',
		'not-insane-psychiatrist@email.com',
		'secure-and-hashed-password',
		'https://avatar.url'
	),
	new User(
		'Harvey Dent',
		'two-face@email.com',
		'secure-and-hashed-password',
		'https://avatar.url',
		'Heads or Tails?'
	),
]
