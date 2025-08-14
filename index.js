const express = require('express')
const cors = require('cors')
require('dotenv').config()
const Note = require('./models/note.js')

const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.get('/', (req, res) => {
	res.send('<h1>Backend!!</h1>')
})

app.get('/api/notes', (req, res) => {
	Note.find({}).then((notes) => {
		res.json(notes)
	})
})

app.get('/api/notes/:id', (req, res, next) => {
	const id = req.params.id
	Note.findById(id)
		.then((note) => {
			if (note) {
				res.json(note)
			} else {
				res.status(404).end()
			}
		})
		.catch((error) => next(error))
})

app.delete('/api/notes/:id', (req, res, next) => {
	const id = req.params.id
	Note.findByIdAndDelete(id)
		.then((result) => {
			res.status(204).end()
		})
		.catch((error) => next(error))
})

app.put('/api/notes/:id', (req, res, next) => {
	const { id, content, important } = req.body
	Note.findById(id)
		.then((note) => {
			if (!note) {
				return res.status(404).end()
			}

			note.content = content
			note.important = important

			return note.save().then((updatedNote) => {
				res.json(updatedNote)
			})
		})
		.catch((error) => next(error))
})

app.post('/api/notes', (req, res, next) => {
	const body = req.body

	const note = new Note({
		content: body.content,
		important: body.important || false,
	})

	note.save()
		.then((result) => {
			res.json(result)
		})
		.catch((error) => next(error))
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

const errorHandler = (error, req, res, next) => {
	console.error(error.message)
	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
	console.log(`server running on port `, PORT)
})
