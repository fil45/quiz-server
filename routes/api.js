const express = require('express');

const router = express.Router();

// Adding of a question
router.post('/questions', function(req, res) {
  res.send({ question: req.body });
});

// Getting of a single question
router.get('/questions/:id', function(req, res) {
  res.send({ type: 'GET' });
});

//Getting of a questions by creterias
// e.g. http://localhost:1234/api/v1/questions?quantity=50&level=3&subject_id=1
router.get('/questions', function(req, res) {
  var url = require('url');
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  res.send({ type: query });
});

//Editing of a question
router.put('/questions/:id', function(req, res) {
  res.send({ type: 'PUT' });
});

//Test begining
router.get('/start', function(req, res) {
  res.send({ type: 'GET' });
});

//Test ending
router.post('/end', function(req, res) {
  res.send({ type: 'POST' });
});

module.exports = router;
