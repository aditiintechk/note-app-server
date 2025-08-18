const { test, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const assert = require('node:assert')
const Note = require('../models/note')
const helper = require('./test_helper.js')

const api = supertest(app)

beforeEach(async () => {
	console.log('deleting all the notes')
	await Note.deleteMany({})

	// recall: how does this work?
	// solution 01
	/* 	const noteObjects = helper.initialNotes.map((note) => new Note(note))
	const promiseArray = noteObjects.map((note) => note.save())
	await Promise.all(promiseArray) */

	// solution 02
	/* 	for (let note of helper.initialNotes) {
		let noteObject = new Note(note)
		await noteObject.save()
		console.log('saved')
	} */

	await Note.insertMany(helper.initialNotes)
	console.log('done')
})

test('notes are retured as json', async () => {
	const response = await api
		.get('/api/notes')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
	const response = await api.get('/api/notes')
	assert.strictEqual(response.body.length, helper.initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
	const response = await api.get('/api/notes')
	const contents = response.body.map((e) => e.content)
	// assert.strictEqual(contents.includes('learning supertest'), true) is simplified
	assert(contents.includes('HTML is easy'))
})

// adding a note
test('a valid note can be added', async () => {
	const newNote = {
		content: 'async/await is understandable.',
		important: true,
	}

	await api
		.post('/api/notes')
		.send(newNote)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const notesAtEnd = await helper.notesInDb()
	assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

	const contents = notesAtEnd.map((n) => n.content)
	assert(contents.includes('async/await is understandable.'))
})

test('note without content is not added', async () => {
	const newNote = {
		important: true,
	}
	await api.post('/api/notes').send(newNote).expect(400)

	const notesAtEnd = await helper.notesInDb()

	assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
})

// fetching a single note

test('a specific note can be viewed', async () => {
	const notesAtStart = await helper.notesInDb()
	const noteToView = notesAtStart[0]
	const id = noteToView.id
	const resultNote = await api
		.get(`/api/notes/${id}`)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	assert.deepStrictEqual(resultNote.body, noteToView)
})

// deleting a note
test('deleting a note', async () => {
	const notesAtStart = await helper.notesInDb()
	const noteToDelete = notesAtStart[0]

	const response = await api
		.delete(`/api/notes/${noteToDelete.id}`)
		.expect(204)
	const notesAtEnd = await helper.notesInDb()
	const contents = notesAtEnd.map((n) => n.content)
	assert(!contents.includes(noteToDelete.content))

	assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
})

after(async () => {
	await mongoose.connection.close()
})
