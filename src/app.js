const express = require('express');
const app = express();

const { adminAuth, userAuth } = require('./middleware/auth');

// Middleware for all the routes of the application
// handle auth middleware for all the requests
app.use("/admin", adminAuth);

app.get('/admin/getAllData', (req, res, next) => {
  // Logic of fetching all data

  // Check if the request is authorized
  // If not authorized, send the response with 401 status code
  // Authorization token --> we can use middleware to check the token
  res.send('All data fetched');
});

app.get('/admin/deleteUser', (req, res, next) => {
  // Logic of fetching data
  res.send('User is Deleted');
});

// app.get('/user', userAuth)

app.get('/user', userAuth, (req, res, next) => {
  res.send('User data fetched');
});

app.get('/user/login', (req, res, next) => {
  res.send('User logged in');
}); // userAuth not applied
 
app.listen(7777, () => {
  console.log('Server is listening on 7777');
});// The server is listening on port 7777

// Difference between app.use() and app.all()
// app.use() --> It is used to define the middleware for all the routes of the application
// app.all() --> It is used to define the middleware for a specific route

// What is a middleware?
// Middleware is a function that has access to the request and response objects
// Middleware functions can execute any code, make changes to the request and response objects, end the request-response cycle, and call the next middleware function in the stack
// Middleware functions can be used to perform the following tasks:
// Execute any code
// Make changes to the request and response objects
// End the request-response cycle
// Call the next middleware function in the stack
// If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function

// Why do we need middleware?
// Middleware is needed to perform tasks that are common to all routes, such as authentication, logging, error handling, etc.
// Middleware functions can be used to perform tasks that are common to all routes, such as authentication, logging, error handling, etc.

