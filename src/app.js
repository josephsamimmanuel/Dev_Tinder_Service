const express = require('express')
const connectDB = require('./config/database')
const app = express()
const User = require('./models/user')

app.post('/signup', async(req, res) => {
  // Create a new user object
  const userObj = {
    firstName: 'Sachin',
    lastName: 'Tendulkar',
    age: 25,
    emailId: 'sachintendulkar@gmail.com',
    password: 'jesuslovesjose4@',
    gender: 'Male',
  }
  // Create a new user instance
  const user = new User(userObj) 
  // Save the user to the database
  try {
    await user.save()
    res.send('User created successfully')
  } catch (error) {
    res.status(400).send('Error creating user'+error)
  }
});

connectDB().then(() => {
  console.log('Connected to MongoDB');
  app.listen(7777, () =>{
    console.log('Server is listening on 7777...')
  })
}).catch((err) => {
  console.error('Error connecting to MongoDB: ', err);
});

