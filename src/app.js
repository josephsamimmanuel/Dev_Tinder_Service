const express = require('express')  // npm install express
const connectDB = require('./config/database')
const app = express()
const cookieParser = require('cookie-parser') // npm install cookie-parser
require('dotenv').config()
const cors = require('cors')
require('./utils/cronjob')

const http = require('http')

app.use(cors({
  origin: ['http://localhost:5173', 'https://devtindercricketapp.netlify.app'],
  credentials: true,
}))

// To parse the incoming requests with JSON payloads
app.use(express.json())

// To parse the incoming requests with urlencoded payloads
app.use(cookieParser())

const authRouter = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const requestRoutes = require('./routes/requests')
const userRouter = require('./routes/user')
const initializeSocket = require('./utils/socket')

app.use('/', authRouter)
app.use('/', profileRoutes)
app.use('/', requestRoutes)
app.use('/', userRouter)

const server = http.createServer(app)
initializeSocket(server)

connectDB().then(() => {
  console.log('Connected to MongoDB');
    server.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${process.env.PORT}...`)
  })
}).catch((err) => {
  console.error('Error connecting to MongoDB: ', err);
});