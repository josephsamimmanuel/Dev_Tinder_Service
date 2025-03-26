const express = require('express')
const { userAuth } = require('../middleware/auth')
const ConnectionRequestModel = require('../models/connectionRequest')
const User = require('../models/user')
const userRouter = express.Router()

// Get all the pending requests for the user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const user = req.user
    const requests = await ConnectionRequestModel.find({ 
        toUserId: user._id, 
        status: 'interested' 
    }).populate('fromUserId', ['firstName', 'lastName', 'photoUrl', 'age', 'gender'])
    res.status(200).json({
        message: 'Pending requests',
        requests: requests
     })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

const USER_DATAS = ['firstName', 'lastName', 'photoUrl', 'age', 'gender']

// Get all the connections for the user
userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const user = req.user
    console.log('user', user)

    // Get all the connections for the user
    const connections = await ConnectionRequestModel.find({ 
        $or: [
            { fromUserId: user._id, status: 'accepted' },
            { toUserId: user._id, status: 'accepted' }
        ]
    }).populate('fromUserId', USER_DATAS)
      .populate('toUserId', USER_DATAS)

    const connectionList = connections.map(connection => {
      console.log('connection', connection)
        return {
            // Display fromUserId or toUserId based on the user's id, if the userId is same as the fromUserId then display toUserId else display fromUserId
            response: connection.fromUserId._id.toString() === user._id.toString() ? connection.toUserId : connection.fromUserId,
            status: connection.status,
            createdAt: connection.createdAt,
            updatedAt: connection.updatedAt
        }
    })
    
    res.status(200).json({
        message: 'Connections fetched successfully',
        connections: connectionList
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Gets the profile of other users on platform - GET /user/feed
userRouter.get('/user/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user

    const page = parseInt(req.query.page) || 1  
    const limit = parseInt(req.query.limit) || 10
    if (limit > 50) {
      return res.status(400).json({ message: 'Limit cannot be greater than 50' })
    }

    // Get all the users except the current user or 
    // the users that are already connected to the current user or 
    // the users that are rejected by the current user pr
    // the users already sent a request to the current user

    // Example: Rahul ---> {Raj, Rohan, Riya, Rajeshwari} - in feed list
    // Rohan rejected Rahul - Rahul has ---> {Raj, Riya, Rajeshwari} - in feedList of Rahul
    // Riya accepted Rahul - Rahul has ---> {Raj, Rajeshwari} - in feedList of Rahul

    // Example: Rohan ---> {Raj, Riya, Rajeshwari} - in feed list
    // Rohan rejected Raj - Rohan has ---> {Riya, Rajeshwari} - in feedList of Rohan
    // Riya accepted Rohan - Rohan has ---> { Rajeshwari} - in feedList of Rohan

    // FIND ALL CONNECTION REQUEST BOTH SEND AND RECEIVED
    const connectionRequests = await ConnectionRequestModel.find({
        $or: [
            { fromUserId: loggedInUser._id },
            { toUserId: loggedInUser._id }
        ]
    }).select('fromUserId toUserId status')

    console.log('connectionRequests', connectionRequests) // The ids of the users who have sent and received connection requests

    // FIND ALL USERS WHO ARE NOT THE LOGGED IN USER AND WHO ARE NOT IN THE CONNECTION REQUESTS
    const hideUsersFromFeed = new Set()
    connectionRequests.forEach(request => {
        hideUsersFromFeed.add(request.fromUserId.toString())
        hideUsersFromFeed.add(request.toUserId.toString())
    })
    console.log('hideUsersFromFeed', hideUsersFromFeed)

    const users = await User.find({
      $and: [
        { _id: { $ne: loggedInUser._id } },   // Not the logged in user
        { _id: { $nin: Array.from(hideUsersFromFeed) } } // Not in the connection requests
      ]
    }).select(USER_DATAS)
    .skip((page - 1) * limit)
    .limit(limit)
    console.log('users', users)

    res.status(200).json({
        message: 'Users fetched successfully',
        connectionRequests: users
    })
    

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = userRouter

