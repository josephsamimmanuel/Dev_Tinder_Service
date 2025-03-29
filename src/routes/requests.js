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
    console.log(req.user, status, toUserId)

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
      message: 'You send ' + status + ' request to ' + toUser.firstName,
      connectionRequest: data
    })
  }
  catch (error) {
    res.status(500).send({message: error.message || 'Error sending connection request'})
  }
})

// Accepting a connection Request API - POST/request/accept/:userId - accept a connection request
// Rejecting a connection Request API - POST/request/reject/:userId - reject a connection request
requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
  try{
    const user = req.user
    const fromUserId = req.user._id
    const status = req.params.status
    const requestId = req.params.requestId


    // User 1 sends a request to User 2
    // logged in user is User 2 must accept or reject the request
    // status = interested
    // status must be accepted or rejected
    // if status is accepted, then add the users to the friends list
    // if status is rejected, then remove the request from the connection request list
    // check if the request Id is valid

    const allowedStatus = ['accepted', 'rejected']
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status ' + status
      })
    }

    // check if the request Id is valid
    const connectionRequest = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: fromUserId,  // User 2 is the logged in user
      status: 'interested'
    })
    console.log('connectionRequest', connectionRequest)
    if (!connectionRequest) {
      return res.status(400).json({
        message: 'Connection request not found'
      })
    }

    connectionRequest.status = status
    const data = await connectionRequest.save()
    res.status(200).json({
      message: 'Connection request ' + status,
      connectionRequest: data
    })
  }
  catch (error) {
    res.status(500).send({message: error.message || 'Error accepting/rejecting connection request'})
  }
})

module.exports = requestRouter