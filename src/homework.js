// - Create a repository
// - Initialize the repository
// - node modules, package.json, package-lock.json, .gitignore
// - Install express
// - Create a server
// - Listen to port 7777
// - Create a request handler for /test
// - Install nodemon and update scripts inside package.json
// - What are dependencies?
// - what is the use of '-g' while npm Install
// - Difference between carat and tilde (^ and ~) in package.json


const express = require('express');

const app = express();

app.get('/test',(req, res) => {
  res.send('Hello World');
});

app.listen(7777, () => {
  console.log('Server is listening on 3000');
});