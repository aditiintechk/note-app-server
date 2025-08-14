const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.kznyirb.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean,
})

// recall: how is the collection named when schema is named singular?
// recall: models are what kind of functions? what do they have access to?
const Note = mongoose.model('Note', noteSchema)

const note = new Note({
	content: 'you all have to do this course to learn fullstack!',
	important: true,
})

/* note.save().then((result) => {
	console.log('note saved!', result)
	mongoose.connection.close()
}) */

Note.find({}).then((result) => {
	result.forEach((note) => {
		console.log(note)
	})
	mongoose.connection.close()
})
