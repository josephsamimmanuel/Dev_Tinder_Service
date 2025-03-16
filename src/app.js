// Creating a server
const express = require('express');

const app = express();

// get - will match only the GET HTTP method API calls to the path
app.get('/user',(req, res) => {
  res.send('User Profile Data');
});

app.post('/user',(req, res) => {
  console.log('Save Data to the Database');
  res.send('User Profile Data Saved');
});

app.delete('/user',(req, res) => {
  res.send('User Profile Data Deleted');
});

// use - will match all the HTTP method API calls to the path
app.use('/hello/2',(req, res) => {
  res.send('AbrakaDabra');
});   // AbrakaDabra

app.use('/hello',(req, res) => {
  res.send('Hello World Hello World Hello World');
});

app.use('/hello/2',(req, res) => {
  res.send('AbrakaDabra');
});     // Hello World


app.use('/test1',(req, res) => {
  res.send('Hello World1');
});

app.use('/test2',(req, res) => {
  res.send('Hello World2');
});


app.use('/test3',(req, res) => {
  res.send('Joseph');
});

// app.use('/',(req, res) => {
//   res.send('Bye World');
// }); // /xyz - Bye World

app.listen(7777, () => {
  console.log('Server is listening on 3000');
});
