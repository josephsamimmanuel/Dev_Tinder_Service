const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_jwt = process.env.SECRET_jwt;
const User = require('../models/user');

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the request cookies
    const { token } = req.cookies
    // Check if the token is present
    if (!token) {
      return res.status(401).send('Unauthorized')
    }
    // Verify the token
    const isVerified = jwt.verify(token, SECRET_jwt)
    // Check if the token is verified
    if (!isVerified) {
      return res.status(401).send('Unauthorized')
    }
    // Fetch the user from the database
    const userId = isVerified._id
    const user = await User.findOne({ _id: userId })
    // Check if the user is present
    if (!user) {
      return res.status(401).send('User not found')
    }
    // Pass the user to the next middleware
    req.user = user

    // Pass the control to the next middleware
    next()
  }
  catch (error) {
    res.status(401).send({ error: 'Please authenticate' + error });
  }
}

module.exports = { userAuth };