import UuidSerializer from './Uuid'
import { describe, test, assert } from 'vitest'

describe('UuidSerializer', () => {
	const uuidSerializer = new UuidSerializer()

	test('Converte um Buffer em uma string UUID', () => {
		const buffer = Buffer.from([
			0x89, 0x70, 0xa1, 0x7f, 0xd8, 0xfd, 0x4a, 0xcf, 0xb9, 0x91, 0xb8, 0xab,
			0x9d, 0x27, 0xa3, 0xe0,
		])

		const uuid = uuidSerializer.stringify(buffer)

		assert.equal(uuid, '8970a17f-d8fd-4acf-b991-b8ab9d27a3e0')
	})

	test('Converte uma string UUID em um Buffer', () => {
		const uuid = '8970a17f-d8fd-4acf-b991-b8ab9d27a3e0'
		const expectedBuffer = Buffer.from([
			0x89, 0x70, 0xa1, 0x7f, 0xd8, 0xfd, 0x4a, 0xcf, 0xb9, 0x91, 0xb8, 0xab,
			0x9d, 0x27, 0xa3, 0xe0,
		])

		const buffer = uuidSerializer.toBuffer(uuid)

		assert.deepEqual(buffer, expectedBuffer)
	})

	test('Recursivamente acessa buffers em um objeto, convertendo todos em strings', () => {
		const object = {
			id: Buffer.from([
				0x89, 0x70, 0xa1, 0x7f, 0xd8, 0xfd, 0x4a, 0xcf, 0xb9, 0x91, 0xb8, 0xab,
				0x9d, 0x27, 0xa3, 0xe0,
			]),
			bool: true,
			number: 42,
			string: 'some text',
			nil: null,
			array: [
				{
					id: Buffer.from([
						0xb7, 0x2f, 0x0b, 0x82, 0xf8, 0x2d, 0x44, 0x29, 0xa5, 0x82, 0x9b,
						0x7f, 0xf5, 0x25, 0x65, 0x4f,
					]),
					nested: {
						id: Buffer.from([
							0x55, 0xbc, 0x0c, 0x77, 0xc5, 0x47, 0x43, 0x7c, 0xbb, 0x28, 0xe8,
							0xfb, 0x1b, 0x30, 0x0c, 0xe1,
						]),
					},
				},
				{
					id: Buffer.from([
						0x43, 0xc6, 0x1e, 0x02, 0x36, 0x5d, 0x42, 0x4c, 0xb5, 0x0a, 0xd4,
						0x2c, 0x3f, 0x83, 0x71, 0x11,
					]),
					nested: {
						id: Buffer.from([
							0x80, 0x2c, 0xc2, 0x50, 0xa5, 0x4b, 0x43, 0x45, 0x93, 0x2f, 0x91,
							0x11, 0x35, 0x9b, 0x92, 0xb4,
						]),
					},
				},
			],
		}

		const expected = {
			id: '8970a17f-d8fd-4acf-b991-b8ab9d27a3e0',
			bool: true,
			number: 42,
			string: 'some text',
			nil: null,
			array: [
				{
					id: 'b72f0b82-f82d-4429-a582-9b7ff525654f',
					nested: {
						id: '55bc0c77-c547-437c-bb28-e8fb1b300ce1',
					},
				},
				{
					id: '43c61e02-365d-424c-b50a-d42c3f837111',
					nested: {
						id: '802cc250-a54b-4345-932f-9111359b92b4',
					},
				},
			],
		}

		const parsed = uuidSerializer.deepStringify(object)

		assert.deepEqual(parsed, expected)
	})

	test('deepStringify não afeta tipos primitivos', () => {
		assert.equal(uuidSerializer.deepStringify(true), true)
		assert.equal(uuidSerializer.deepStringify(42), 42)
		assert.equal(uuidSerializer.deepStringify('texto'), 'texto')
		assert.equal(uuidSerializer.deepStringify(undefined), undefined)
		assert.equal(uuidSerializer.deepStringify(null), null)
	})

	test('stringify rejeita buffers inválidos', () => {
		assert.throws(() => uuidSerializer.stringify(Buffer.alloc(16)))
		assert.throws(() =>
			uuidSerializer.stringify(Buffer.from('dc654afe87a54fc454d357e89', 'hex'))
		)
	})

	test("toBuffer rejeita uuid's inválidos", () => {
		assert.throws(() => uuidSerializer.toBuffer('dc654afe87a54fc454d357e89'))
	})
})
