// Creating a server
const express = require('express');

const app = express();

// get - will match only the GET HTTP method API calls to the path
// http://localhost:7777/user?userId=001&id=551515212121545
app.get('/user',(req, res) => {
  console.log(req.query);
  res.send({firstName: 'Joseph', lastName: 'Sam Immanuel'});
});

// http://localhost:7777/user/007/joseph/jesuslovesjose4@
app.get('/user/:userId/:name/:password',(req, res) => {
  console.log(req.params);
  res.send({firstName: 'Joseph', lastName: 'Sam Immanuel'});
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

app.use('/',(req, res) => {
  res.send('Bye World');
}); // /xyz - Bye World

// Use of ?, +, *, and () in the path
app.get('/ab?cd', (req, res) => {
  res.send('Joseph Sam Immanuel');
}); // b is optional

app.get('/a(bc)?d', (req, res) => { 
  res.send('Joseph Sam Immanuel');
}); // ad, abcd

app.get('/a(bc)*d', (req, res) => { 
  res.send('Joseph Sam Immanuel');
}); // ad, abcd, abcbcd, abcbcbcd

app.get('/ab+cd', (req, res) => { // b can be repeated
  res.send('Joseph Sam Immanuel');
}); // abcd, abbcd, abbbcd, abbbbcd

app.get('/ab*cd', (req, res) => { // add betweern b and c
  res.send('Joseph Sam Immanuel');
}); // abcd, abbcd, abbbcd, abbbbcd

app.listen(7777, () => {
  console.log('Server is listening on 3000');
});
