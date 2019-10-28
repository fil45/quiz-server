const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use('/api/v1', require('./routes/api'));

app.listen(process.env.port || 1234, function() {
  console.log('Listening for requests');
});
