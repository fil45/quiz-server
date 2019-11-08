const express = require('express');
const validate = require('express-validation');
const questionValidation = require('../validation/question.js');
const queryValidation = require('../validation/query.js');
const updateValidation = require('../validation/update.js');
const url = require('url');
const { Questions, Answers } = require('../db');
const bcrypt = require('bcrypt');
const { HOST, PORT, HASH } = require('../constants');

const router = express.Router();

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
      })
      .then(_ => {
        res.status(200).send('Ok');
      })
      .catch(e => {
        res.status(500).send('Server error');
        console.error('Error: ', e);
      });
    } else {
      res.status(401).send('Invalid password');
    }
  });
});

// Getting of a single question
router.get('/questions/:id', function(req, res) {
    Questions.findOne({ where: { id: req.params.id },  include: [Answers] })
      .then(question => {
        if (question) {
          question = question.dataValues;
          res.status(200).send(question);
        } else {
          res.status(404).send('Not found');
        }
      })
      .catch(e => {
        res.status(500).send('Server error');
        console.error('Error: ', e);
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
      res.status(200).send({ questions, nextPage });
    })
    .catch(e => {
      res.status(500).send('Server error');
      console.error('Error: ', e);
    });
});

//Editing of a question
router.put('/questions', validate(updateValidation), function(req, res) {
  bcrypt.compare(req.body.password, HASH).then(function(pass) {
    if (pass) {
      Questions.findOne({ where: { id: req.body.id }, include: [Answers] })
        .then(question => {
          if (question) {
          //TODO check ids of answers in request question.answers.id
          //TODO validate answers correctness and uniqueness
           question.update(req.body)
            .then(updatedQuestion => {
              if (updatedQuestion) {
                updatedQuestion.answers.forEach(answer => {
                  answer.update(answer.dataValues)
                  .catch(e => {
                    res.status(500).send('Server error');
                    console.error('Error: ', e);
                    return;
                  });
                })
                res.status(200).send('Ok')
                return;
              } else {
                res.status(500).send('Server error');
                return;
              }
            })
            .catch(e => {
              res.status(500).send('Server error');
              console.error('Error: ', e);
            });
          } else {
            res.status(404).send('Not found');
          }
        })
    } else {
      res.status(401).send('Invalid password');
     }
  });
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
