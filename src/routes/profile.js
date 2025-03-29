const express = require('express');
const { userAuth } = require('../middleware/auth');
const User = require('../models/user');
const { validateUpdateProfileData, validateUpdatePasswordData } = require('../utils/validation');
const bcrypt = require('bcrypt');

const profileRouter = express.Router()

// Profile API - GET/profile - get user profile
profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
      const user = req.user
      // User not found
      if (!user) {
        return res.status(404).send('User not found')
      }
      // Send the user as a response to the client
      res.json({
        message: 'User fetched successfully',
        data: user
      })
    } catch (error) {
      // Send an error response if something went wrong
      res.status(500).send('Error fetching user from database'+ error)
    }
  });

  // Profile API - PUT/profile/update - update user profile
profileRouter.patch('/profile/update', userAuth, async (req, res) => {
    try {
      // Validate the request body
      if(!validateUpdateProfileData(req)) {
        return res.status(400).send('These fields are not allowed to be updated')
      }
      const user = req.user
      const { firstName, lastName, age, gender, photoUrl, about, skills } = req.body
      // Update the user profile
      const updatedUser = await User.findByIdAndUpdate(user._id, { firstName, lastName, age, gender, photoUrl, about, skills }, { new: true }, { runValidators: true })
      if (!updatedUser) {
        return res.status(404).send('User not found')
      }
      // Send the updated user as a response to the client
      res.send({
        message: 'User profile updated successfully',
        data: updatedUser
      })

    } catch (error) {
      // Send an error response if something went wrong
      res.status(500).send('Error updating user profile'+ error)
    }
  });

  // Profile API - PATCH/profile/password - update user password
profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
      const user = req.user
      const { password } = req.body
      if(!validateUpdatePasswordData(req)) {
        return res.status(400).send('Invalid password')
      }
      // ENCRYPT PASSWORD
      const passwordHash = await bcrypt.hash(password, 6)
      req.body.password = passwordHash
      // Update the user password
      const updatedUser = await User.findByIdAndUpdate(user._id, { password: passwordHash }, { new: true }, { runValidators: true })
      if (!updatedUser) {
        return res.status(404).send('User not found')
      }
      res.send({
        message: 'User password updated successfully',
        data: updatedUser
      })
    } catch (error) {
      // Send an error response if something went wrong
      res.status(500).send('Error updating user password'+ error)
    }
  })


  module.exports = profileRouter