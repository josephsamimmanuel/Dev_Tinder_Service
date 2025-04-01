const express = require('express')
const app = express()

// Handling errors in Express
// Error handling middleware in Express

app.use('/getUserData',(req,res) => {
  // try {
  //   // Logic of DB call and fetching user data
  //   throw new Error('User not found')
  //   res.send('User data fetched')
  // } catch (error) {
  //   console.error(error.stack)
  //   res.status(500).send('Something broke. Contact Us!')
  // }
  // Logic of DB call and fetching user data
  throw new Error('User not found')
  res.send('User data fetched')
})

// Error handling middleware in any route
app.use('/', (err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(7777, () =>{
  console.log('Server is listening on 7777')
})