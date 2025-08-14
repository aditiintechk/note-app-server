const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGO_URI
mongoose
	.connect(url)
	.then((result) => {
		console.log('connected to mongodb')
	})
	.catch((error) => {
		console.log('error connecting to mongodb', error.message)
	})

const noteSchema = new mongoose.Schema({
	content: {
		type: String,
		minLength: 5,
		required: true,
	},
	important: Boolean,
})

// format the response
noteSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
})

module.exports = mongoose.model('Note', noteSchema)
