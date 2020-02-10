const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/v1', require('./routes/api'));
app.use(function(err, req, res, next) {
  res.status(422).json(err);
});

module.exports = app;
