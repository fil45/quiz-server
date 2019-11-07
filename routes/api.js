const express = require('express');
const validate = require('express-validation');
const questionValidation = require('../validation/question.js');
const queryValidation = require('../validation/query.js');
const url = require('url');
const router = express.Router();
const { Questions, Answers } = require('../db');
const bcrypt = require('bcrypt');
var Joi = require('joi');

const hash = '$2b$10$PjqecawtIkC0tAPJhKjHGOH7N8KyZuhMNoQtP79fE.zGnoHnbjuxe';

validate.options({
  status: 422,
  statusText: 'Unprocessable Entity',
});

// Adding of a question
router.post('/questions', validate(questionValidation), function(req, res) {
  const { password, question, subjectId, level, answers } = req.body;
  bcrypt.compare(password, hash).then(function(pass) {
    if (pass) {
      Questions.create(
        {
          question,
          subjectId,
          level,
          answers: [
            {
              answer: answers[0].answer,
              isCorrect: answers[0].isCorrect,
            },
            {
              answer: answers[1].answer,
              isCorrect: answers[1].isCorrect,
            },
            {
              answer: answers[2].answer,
              isCorrect: answers[2].isCorrect,
            },
            {
              answer: answers[3].answer,
              isCorrect: answers[3].isCorrect,
            },
          ],
        },
        {
          include: [Answers],
        }
      ).catch(e => {
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
  const result = Joi.validate(query, queryValidation);
  if (result.error) {
    res.send(result.error.details[0].message);
    return;
  }
  const params = {
    where: {},
    include: [Answers],
  };
  if (query.level) params.where.level = query.level;
  if (query.subjectId) params.where.subjectId = query.subjectId;
  if (query.start) params.offset = parseInt(query.start);
  if (query.quantity) params.limit = parseInt(query.quantity);
  console.log(params);
  Questions.findAll(params)
    .then(questions => {
      res.send(questions);
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
