const express = require('express');
const validate = require('express-validation');
const questionValidation = require('../validation/question.js');
const queryValidation = require('../validation/query.js');
const url = require('url');
const router = express.Router();
const { Questions, Answers } = require('../db');
const bcrypt = require('bcrypt');
const { HOST, PORT, HASH } = require('../constants');

validate.options({
  status: 422,
  statusText: 'Unprocessable Entity',
});

// Adding of a question
router.post('/questions', validate(questionValidation), function(req, res) {
  bcrypt.compare(req.body.password, HASH).then(function(pass) {
    if (pass) {
      //TODO add validation that only one answer is correct and that there are no identical answers
      Questions.create(req.body, {
        include: [Answers],
      }).catch(e => {
        console.error('Error: ', e.message);
      });
      res.status(200).send('Ok');
    } else {
      res.status(401).send('Invalid password');
    }
  });
});

// Getting of a single question
router.get('/questions/:id', function(req, res) {
  Answers.findAll({ where: { questionId: req.params.id } })
    .then(answers => {
      if (answers.length === 0) {
        res.status(404).send('Not found');
      } else {
        answers = answers.map(answer => answer.dataValues);
        Questions.findOne({ where: { id: req.params.id } })
          .then(question => {
            question = question.dataValues;
            question.answers = answers;
            res.send(question);
          })
          .catch(e => {
            console.error('Error: ', e.message);
          });
      }
    })
    .catch(e => {
      console.error('Error: ', e.message);
    });
});

//Getting of a questions by creterias
// e.g. http://localhost:1234/api/v1/questions?quantity=50&level=3&subjectId=1&start=10
router.get('/questions', validate(queryValidation), function(req, res) {
  const url_parts = url.parse(req.url, true);
  const query = url_parts.query;
  const params = {
    where: {},
    include: [Answers],
  };
  if (query.level) params.where.level = query.level;
  if (query.subjectId) params.where.subjectId = query.subjectId;
  if (query.start) params.offset = parseInt(query.start);
  if (query.quantity) params.limit = parseInt(query.quantity);
  Questions.findAll(params)
    .then(questions => {
      let nextPage;
      if (query.quantity) {
        nextPage = `http://${HOST}:${PORT}/api/v1/questions?quantity=${
          query.quantity
        }&start=${query.start?+query.quantity + +query.start:query.quantity}`;
        if (query.level) {
          nextPage += `&level=${query.level}`;
        }
        if (query.subjectId) {
          nextPage += `&subjectId=${query.subjectId}`;
        }
      }
      res.send({ questions, nextPage });
    })
    .catch(e => {
      console.error('Error: ', e.message);
    });
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
