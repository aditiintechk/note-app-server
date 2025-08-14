const express = require('express')
const cors = require('cors')
require('dotenv').config()
const Note = require('./models/note.js')

const app = express()

const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

let notes = [
	{
		id: '1',
		content: 'HTML is easy',
		important: true,
	},
	{
		id: '2',
		content: 'Browser can execute only JavaScript',
		important: false,
	},
	{
		id: '3',
		content: 'GET and POST are the most important methods of HTTP protocol',
		important: true,
	},
]

app.get('/', (req, res) => {
	res.send('<h1>Hello</h1>')
})

app.get('/api/notes', (req, res) => {
	Note.find({}).then((notes) => {
		res.json(notes)
	})
})

app.get('/api/notes/:id', (req, res) => {
	const id = req.params.id
	Note.findById(id).then((note) => res.json(note))
})

app.delete('/api/notes/:id', (req, res) => {
	const id = req.params.id
	notes = notes.filter((note) => note.id !== id)

	res.status(204).end('deleted')
})

app.post('/api/notes', (req, res) => {
	const body = req.body
	if (!body.content) {
		return res.status(400).json({ error: 'content missing' })
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
	})

	note.save().then((result) => {
		res.json(result)
	})
})

const requestLogger = (req, res, next) => {
	console.log('method', req.method)
	console.log('Path:  ', req.path)
	console.log('Body:  ', req.body)
	next()
}

app.use(requestLogger)

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.listen(PORT, () => {
	console.log(`server running on port `, PORT)
})
