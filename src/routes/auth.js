const express = require('express');
const User = require('../models/user');
const { validateSignupData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const { userAuth } = require('../middleware/auth');

const authRouter = express.Router()

// signup API - POST/signup - create a new user
authRouter.post('/signup', async (req, res) => {
  
    try {
      const { firstName, lastName, emailId, password, age, gender,skills, photoUrl, about } = req.body
  
      // VALIDATION OF REQUEST BODY
      validateSignupData(req)
  
      // ENCRYPT PASSWORD
      const passwordHash = await bcrypt.hash(password, 6)
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
authRouter.post('/login', async (req, res) => {
    try {
      const userDetails = req.user
      const { emailId, password } = req.body
  
      //CREATE INSTANCE OF USER MODEL
      const user = await User
        .findOne({ emailId })
      if (!user) {
        return res.status(404).send('User not found')
      }
      // Compare the password
  
      // Validation added to user schema
      const isMatch = await user.validatePassword(password)
  
      if (!isMatch) {
        return res.status(400).send('Invalid credentials')
      }
  
      // Create a JWT token
      const token = await user.getJWT()
  
      // Add the token to cookies and send the response to the client
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000 // 1 hour in milliseconds
      })
  
      // Send a success response to the client
      res.status(200).json({
        message: 'User logged in successfully',
        data: user,
        token: token
      })
    } catch (error) {
      // Send an error response if something went wrong while logging in
      res.status(400).send('Error logging in user')
    }
  });

  // logout API - POST/logout - logout user
authRouter.post('/logout', async (req, res) => {
    res.clearCookie('token')
    res.json({
      message: 'User logged out successfully'
    })
  })

  module.exports = authRouter