const { test, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const assert = require('node:assert')
const Note = require('../models/note')

const api = supertest(app)

const initialNotes = [
	{
		content: 'HTML is easy',
		important: false,
	},
	{
		content: 'Browser can execute only JavaScript',
		important: true,
	},
]

beforeEach(async () => {
	console.log('deleting all the notes')
	await Note.deleteMany({})
	let noteObject = new Note(initialNotes[0])
	await noteObject.save()
	console.log('note saved')
	noteObject = new Note(initialNotes[1])
	await noteObject.save()
	console.log('note saved')
})

test('notes are retured as json', async () => {
	await api
		.get('/api/notes')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
	const response = await api.get('/api/notes')
	assert.strictEqual(response.body.length, initialNotes.length)
})

test.only('a specific note is within the returned notes', async () => {
	const response = await api.get('/api/notes')
	const contents = response.body.map((e) => e.content)
	// assert.strictEqual(contents.includes('learning supertest'), true) is simplified
	assert(contents.includes('HTML is easy'))
})

after(async () => {
	await mongoose.connection.close()
})
