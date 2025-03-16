// Creating a server
const express = require('express');

const app = express();

app.use('/user', (req, res, next) => {
  // Route Handler
  // res.send('Route Handler 1');
  console.log('Handling the Router back');
  // res.send('Hello from the router: Resposnse 1');
  next();
}, (req, res) => {
  console.log('Handling the Router back');
  res.send('Hello from the router: Response 2');
});

app.listen(7777, () => {
  console.log('Server is listening on 3000');
});
