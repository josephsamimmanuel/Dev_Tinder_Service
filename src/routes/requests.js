const express = require('express')
const { userAuth } = require('../middleware/auth')

const requestRouter = express.Router()

// Sending a connection Request API - POST/sendConnectionRequest - send a connection request
requestRouter.post('/sendConnectionRequest', userAuth, async(req, res) => {
    try {
      const user = req.user
      console.log('UserSendConnection:', user)
  
      res.send(`${user.firstName} sends you a connection request`)
  
    }
    catch (error) {
      res.status(500).send('Error sending connection request')
    }
  })

  module.exports = requestRouter