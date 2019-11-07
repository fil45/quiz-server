const express = require('express');
const bodyParser = require('body-parser');
const { db } = require('./db');
const generateData = require('./generator');

const app = express();

app.use(bodyParser.json());

app.use('/api/v1', require('./routes/api'));

db.sync({ logging: false }).then(function() {
  app.listen(process.env.port || 1234, function() {
    console.log('Listening for requests');
  });
});

//setTimeout(generateData, 3000, 10);
