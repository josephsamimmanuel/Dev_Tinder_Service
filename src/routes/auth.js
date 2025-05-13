const express = require('express');
const User = require('../models/user');
const { validateSignupData } = require('../utils/validation');
const bcrypt = require('bcrypt');

const authRouter = express.Router()

// signup API - POST/signup - create a new user
authRouter.post('/signup', async (req, res) => {
  
    try {
      const { firstName, lastName, emailId, password } = req.body
        
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
        password: passwordHash,
      })
      // Save the user to the database
      const savedUser = await user.save()
      // Create a JWT token
      const token = await savedUser.getJWT()
      // Add the token to cookies
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000 // 1 hour in milliseconds
      })
      // Send a success response to the client
      res.status(201).json({
        message: 'User created successfully',
        data: savedUser
      })

    } catch (error) {
      // Send an error response if something
      // went wrong while creating the user
      res.status(400).send('new' + error)
    }
  });

  // login API - POST/login - login user
authRouter.post('/login', async (req, res) => {
    try {
      const { emailId, password } = req.body
  
      console.log('Login attempt for:', emailId);
      console.log('Request origin:', req.headers.origin);
      console.log('Request headers:', req.headers);
  
      //CREATE INSTANCE OF USER MODEL
      const user = await User
        .findOne({ emailId })
      if (!user) {
        console.log('User not found:', emailId);
        return res.status(404).send('User not found')
      }
      // Compare the password
  
      // Validation added to user schema
      const isMatch = await user.validatePassword(password)
  
      if (!isMatch) {
        console.log('Invalid password for user:', emailId);
        return res.status(400).send('Invalid credentials')
      }
  
      // Create a JWT token
      const token = await user.getJWT()
      console.log('Token generated:', token);

      // Add the token to cookies and send the response to the client
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 3600000, // 1 hour in milliseconds
        path: '/',
        domain: '.onrender.com'  // Add the domain
      };
      
      console.log('Setting cookie with options:', cookieOptions);
      res.cookie("token", token, cookieOptions);
      console.log('Cookie set with token');

      // Log response headers
      console.log('Response headers:', res.getHeaders());

      // Send a success response to the client
      res.status(200).json({
        message: 'User logged in successfully',
        data: user,
        token: token
      })
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error stack:', error.stack);
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