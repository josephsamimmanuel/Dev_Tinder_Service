const express = require('express')  // npm install express
const connectDB = require('./config/database')
const app = express()
const User = require('./models/user')
const { validateSignupData } = require('./utils/validation')
const bcrypt = require('bcrypt')    // npm install bcrypt
const cookieParser = require('cookie-parser') // npm install cookie-parser
const jwt = require('jsonwebtoken') // npm install jsonwebtoken
const { userAuth } = require('./middleware/auth')

// To parse the incoming requests with JSON payloads
app.use(express.json())

// To parse the incoming requests with urlencoded payloads
app.use(cookieParser())

// signup API - POST/signup - create a new user
app.post('/signup', async (req, res) => {
  console.log('Request received', req.body)

  try {
    const { firstName, lastName, emailId, password, age, gender,skills, photoUrl, about } = req.body

    // VALIDATION OF REQUEST BODY
    validateSignupData(req)

    // ENCRYPT PASSWORD
    const passwordHash = await bcrypt.hash(password, 8)
    console.log(passwordHash)
    req.body.password = passwordHash

    // CREATE INSTANCE OF USER MODEL
    const user = new User({
      firstName,
      lastName,
      emailId,
      age,
      gender,
      skills,
      photoUrl,
      about,
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

// login API - POST/login - login user
app.post('/login', async (req, res) => {
  console.log('Request received', req.body)
  try {
    const { emailId, password } = req.body

    //CREATE INSTANCE OF USER MODEL
    const user = await User
      .findOne({ emailId })
    if (!user) {
      return res.status(404).send('User not found')
    }
    // Compare the password
    console.log('User:', user.password, 'Password:', password);

    const isMatch = await bcrypt.compare(password.trim(), user.password.trim());
    console.log('Is match:', isMatch);

    if (!isMatch) {
      return res.status(400).send('Invalid credentials')
    }

    // Create a JWT token
    const token = await jwt.sign({ _id: user._id }, 'devtinder@312', { expiresIn: '1h' })
    console.log('Token:', token)

    // Add the token to cookies and send the response to the client
    res.cookie("token", token)

    // Send a success response to the client
    res.send('User logged in successfully')
  } catch (error) {
    // Send an error response if something went wrong while logging in
    res.status(400).send('Error logging in user')
  }
});

// Profile API - GET/profile - get user profile
app.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user
    console.log('User:', user)
    // User not found
    if (!user) {
      return res.status(404).send('User not found')
    }
    // Send the user as a response to the client
    res.send(user)
  } catch (error) {
    // Send an error response if something went wrong
    res.status(500).send('Error fetching user from database'+ error)
  }
});

// Sending a connection Request API - POST/sendConnectionRequest - send a connection request
app.post('/sendConnectionRequest', userAuth, async(req, res) => {
  try {
    const user = req.user
    console.log('UserSendConnection:', user)

    res.send(`${user.firstName} sends you a connection request`)

  }
  catch (error) {
    res.status(500).send('Error sending connection request')
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

