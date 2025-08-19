const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('../tests/test_helper.js')

// implement: do the optional exercises

// check: why error handling did not work here?

usersRouter.post('/', async (request, response) => {
	const { username, name, password } = request.body
	const users = await helper.usersInDb()
	const usernames = users.map((user) => user.username)

	if (usernames.includes(username)) {
		response.status(400).json({ error: 'expected username to be unique' })
	} else {
		const saltRounds = 10
		const passwordHash = await bcrypt.hash(password, saltRounds)

		const user = new User({
			username,
			name,
			passwordHash,
		})

		const savedUser = await user.save()
		response.status(201).json(savedUser)
	}
})

module.exports = usersRouter
