const express = require('express');
const { userAuth } = require('../middleware/auth');
const User = require('../models/user');

const profileRouter = express.Router()

// Profile API - GET/profile - get user profile
profileRouter.get('/profile/view', userAuth, async (req, res) => {
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

  // Profile API - PUT/profile/update - update user profile
profileRouter.patch('/profile/update', userAuth, async (req, res) => {
    try {
      // Validate the request body
      validateUpdateProfileData(req)
      const user = req.user
      console.log('User:', user)
      const { firstName, lastName, age, gender, photoUrl, about, skills } = req.body
      const updatedUser = await User.findByIdAndUpdate(user._id, { firstName, lastName, age, gender, photoUrl, about, skills }, { new: true }, { runValidators: true })
      if (!updatedUser) {
        return res.status(404).send('User not found')
      }
      // Send the updated user as a response to the client
      console.log('Updated user:', updatedUser)
      res.send(updatedUser)

    } catch (error) {
      // Send an error response if something went wrong
      res.status(500).send('Error updating user profile'+ error)
    }
  });

  module.exports = profileRouter