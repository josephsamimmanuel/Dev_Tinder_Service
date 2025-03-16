// Creating a server
const express = require('express');

const app = express();

// app.use('route', rH1, rH2, rH3, rH4);

app.use('/user', [(req, res, next) => {
  // Route Handler
  // res.send('Route Handler 1');
  console.log('Handling the Router back 1', req.url, req.method);
  next(); // This will pass the control to the next middleware
  // res.send('Hello from the router: Resposnse 1');
  // next();
}, (req, res, next) => {
  console.log('Handling the Router back 2', req.url, req.method);
  // res.send('Hello from the router: Response 2');
  next();
}, (req, res, next) => { // This will not be executed as the response is already sent
  console.log('Handling the Router back 3', req.url, req.method);
  // res.send('Hello from the router: Response 3');
  next();
}, (req, res, next) => { // This will not be executed as the response is already sent
  console.log('Handling the Router back 4', req.url, req.method);
  // res.send('Hello from the router: Response 4');
  next(); // This will pass the control to the next middleware // Cannot get /user
}]);

app.listen(7777, () => {
  console.log('Server is listening on 3000');
});
