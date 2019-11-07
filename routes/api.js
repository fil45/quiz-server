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
  const {quantity, start, level, subjectId} = url.parse(req.url, true).query;
  const params = {
    where: {},
    include: [Answers],
  };
  if (level) params.where.level = level;
  if (subjectId) params.where.subjectId = subjectId;
  if (start) params.offset = parseInt(start);
  if (quantity) params.limit = parseInt(quantity);
  Questions.findAll(params)
    .then(questions => {
      let nextPage;
      if (quantity) {
        nextPage = `http://${HOST}:${PORT}/api/v1/questions?quantity=${
          quantity
        }&start=${start?+quantity + +start:quantity}`;
        if (level) {
          nextPage += `&level=${level}`;
        }
        if (subjectId) {
          nextPage += `&subjectId=${subjectId}`;
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
