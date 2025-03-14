const express = require('express');

const app = express();

app.get('/test',(req, res) => {
  res.send('Hello World');
});

app.listen(7777, () => {
  console.log('Server is listening on 3000');
});