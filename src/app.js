const express = require('express')
const connectDB = require('./config/database')
const app = express()

connectDB().then(() => {
  console.log('Connected to MongoDB');
  app.listen(7777, () =>{
    console.log('Server is listening on 7777...')
  })
}).catch((err) => {
  console.error('Error connecting to MongoDB: ', err);
});

