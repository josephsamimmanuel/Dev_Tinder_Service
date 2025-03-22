const express = require('express')  // npm install express
const connectDB = require('./config/database')
const app = express()
const cookieParser = require('cookie-parser') // npm install cookie-parser

// To parse the incoming requests with JSON payloads
app.use(express.json())

// To parse the incoming requests with urlencoded payloads
app.use(cookieParser())

const authRouter = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const requestRoutes = require('./routes/requests')
app.use('/', authRouter)
app.use('/', profileRoutes)
app.use('/', requestRoutes)

connectDB().then(() => {
  console.log('Connected to MongoDB');
  app.listen(7777, () => {
    console.log('Server is listening on 7777...')
  })
}).catch((err) => {
  console.error('Error connecting to MongoDB: ', err);
});

