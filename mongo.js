const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.TEST_MONGO_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
	content: 'you all have to do this course to learn fullstack!',
	important: true,
})

const note1 = new Note({
	content: 'learning supertest',
	important: true,
})

note.save().then((result) => {
	console.log('note saved!', result)
})

note1.save().then((result) => {
	console.log('note saved!', result)
})

Note.find({}).then((result) => {
	result.forEach((note) => {
		console.log(note)
	})
	mongoose.connection.close()
})
