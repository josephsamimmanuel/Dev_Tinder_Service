const express = require('express')
const connectDB = require('./config/database')
const app = express()
const User = require('./models/user')
const { validateSignupData } = require('./utils/validation')
const bcrypt = require('bcrypt')

// To parse the incoming requests with JSON payloads
app.use(express.json())

app.post('/signup', async (req, res) => {
  console.log('Request received', req.body)

  try {
    const { firstName, lastName, emailId, password } = req.body

    // VALIDATION OF REQUEST BODY
    validateSignupData(req)

    // ENCRYPT PASSWORD
    const passwordHash = await bcrypt.hash(password, 10)
    console.log(passwordHash)
    req.body.password = passwordHash

    // CREATE INSTANCE OF USER MODEL
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    })
    // Save the user to the database
    await user.save()
    // Send a success response to the client
    res.send('User created successfully')
  } catch (error) {
    // Send an error response if something
    // went wrong while creating the user
    res.status(400).send('new' + error)
  }
});

// Feed API - GET/feed -get all the users from the database
app.get('/feed', async (req, res) => {
  try {
    // Get user email from the request body
    const userEmail = req.body.emailId
    const id = req.body._id

    console.log('User email:', userEmail, id)

    // Fetch all the users from the database
    // const users = await User.find({emailId: userEmail})
    // Fetch user using findOne - returns the first user that matches the query

    // Fetch all the users from the database
    const user = await User
      .findOne({ emailId: userEmail, _id: id })
    console.log('Users:', user)
    // Send the users as a response to the client
    if (user.length === 0) {
      res.status(404).send('No users found')
    } else {
      res.send(user)
    }
  } catch (error) {
    // Send an error response if something went wrong
    res.status(500).send('Error fetching users from database', error)
  }
});

app.get('/users', async (req, res) => {
  try {
    const emailId = req.body.emailId
    // Fetch all the users from the database
    const users = await User.find({})
    // Send the users as a response to the client
    res.send(users)
  }
  catch (error) {
    res.status(500).send('Error fetching users from database', error)
  }
})

app.delete('/delete', async (req, res) => {
  try {
    // Get user id from the request body
    const id = req.body._id
    // Find the user by id and delete it
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      res.status(404).send('User not found')
    } else {
      res.send('User deleted successfully')
    }
  }
  catch (error) {
    res.status(500).send('Error deleting user from database', error)
  }
})

app.patch('/update/:userId', async (req, res) => {
  try {
    // Get user id from the request body
    // const id = req.body.userId
    const id = req.params.userId
    console.log(req.body);

    // ALLOWED UPDATES
    const ALLOWED_UPDATES = ['photoUrl', 'about', 'gender', 'age', 'skills']
    const isUpdateAllowed = Object.keys(req.body).every((update) => {
      console.log('Request Fields', Object.keys(req.body), 'Allowed Updates', ALLOWED_UPDATES)
      return ALLOWED_UPDATES.includes(update)
    })
    console.log('Is update allowed:', isUpdateAllowed)
    if (!isUpdateAllowed) {
      return res.status(400).send('Update not allowed for these fields!')
    }
    if (req.body?.skills.length > 10) {
      return res.status(400).send('Skills should be less than 10')
    }
    // Find the user by id and update it
    const user = await User.findByIdAndUpdate
      (id, req.body, { new: true, runValidators: true })
    if (!user) {
      res.status(404).send('User not found')
    }
    else {
      res.send('User updated successfully')
    }

  }
  catch (error) {
    res.status(500).send('Error updating user from database', error)
  }
})

connectDB().then(() => {
  console.log('Connected to MongoDB');
  app.listen(7777, () => {
    console.log('Server is listening on 7777...')
  })
}).catch((err) => {
  console.error('Error connecting to MongoDB: ', err);
});

