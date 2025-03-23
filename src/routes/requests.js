const express = require('express')
const { userAuth } = require('../middleware/auth')
const ConnectionRequestModel = require('../models/connectionRequest')
const User = require('../models/user')

const requestRouter = express.Router()

// Sending a connection Request API - POST/request/send/interested/:userId - send a connection request
// Ignoring a connection Request API - POST/request/ignore/:userId - ignore a connection request
requestRouter.post('/request/send/:status/:userId', userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id
    const toUserId = req.params.userId
    const status = req.params.status
    console.log(req.user)

    // Check if the user is trying to send a request to himself
    // if (fromUserId.toString() === toUserId.toString()) {
    //   return res.status(400).json({
    //     message: 'You cannot send a request to yourself'
    //   })
    // }

    // Check if the status is valid
    const allowedStatus = ['interested', 'ignored']
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status ' + status
      })
    }

    // Check if the connection request already exists
    const existingRequest = await ConnectionRequestModel.findOne({
      // FROM USER ID TO USER ID OR FROM USER ID TO USER ID
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    })

    if (existingRequest) {
      return res.status(400).json({
        message: 'Connection request already exists'
      })
    }

    // Check toUserId is a valid user
    const toUser = await User.findById(toUserId)
    if (!toUser) {
      return res.status(400).json({
        message: 'Invalid user id'
      })
    }

    const connectionRequest = await ConnectionRequestModel.create({
      fromUserId,
      toUserId,
      status,
    })
    const data = await connectionRequest.save()
    res.status(201).json({
      message: req.user.firstName + ' sends ' + status + ' request to ' + toUser.firstName,
      connectionRequest: data
    })
  }
  catch (error) {
    res.status(500).send({message: error.message || 'Error sending connection request'})
  }
})

module.exports = requestRouter