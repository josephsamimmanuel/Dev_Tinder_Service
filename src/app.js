// Creating a server
const express = require('express');

const app = express();

app.get('/test',(req, res) => {
  res.send('Hello World');
});

app.get('/test1',(req, res) => {
  res.send('Hello World1');
});

app.get('/test2',(req, res) => {
  res.send('Hello World2');
});

app.get('/test3',(req, res) => {
  res.send('Joseph');
});

app.listen(7777, () => {
  console.log('Server is listening on 3000');
});
