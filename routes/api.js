const express = require('express');
const Sequelize = require('sequelize');
const validate = require('express-validation');
const questionValidation = require('../validation/question.js');
const queryValidation = require('../validation/query.js');
const updateValidation = require('../validation/update.js');
const validateAnswersUpdate = require('../validation/answers.js');
const startValidation = require('../validation/start.js');
const url = require('url');
const { Questions, Answers } = require('../db');
const bcrypt = require('bcrypt');
const { HOST, PORT, HASH } = require('../constants');

const router = express.Router();

const ongoingTests = {};

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
          return;
        })
        .catch(e => {
          res.status(500).send('Server error');
          console.error('Error: ', e);
          return;
        });
    } else {
      res.status(401).send('Invalid password');
      return;
    }
  });
});

// Getting of a single question
router.get('/questions/:id', function(req, res) {
  Questions.findOne({ where: { id: req.params.id }, include: [Answers] })
    .then(question => {
      if (question) {
        question = question.dataValues;
        res.status(200).send(question);
        return;
      } else {
        res.status(404).send('Not found');
        return;
      }
    })
    .catch(e => {
      res.status(500).send('Server error');
      console.error('Error: ', e);
      return;
    });
});

//Getting of a questions by creterias
// e.g. http://localhost:1234/api/v1/questions?quantity=50&level=3&subjectId=1&start=10
router.get('/questions', validate(queryValidation), function(req, res) {
  const { quantity, start, level, subjectId } = url.parse(req.url, true).query;
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
        nextPage = `http://${HOST}:${PORT}/api/v1/questions?quantity=${quantity}&start=${
          start ? +quantity + +start : quantity
        }`;
        if (level) {
          nextPage += `&level=${level}`;
        }
        if (subjectId) {
          nextPage += `&subjectId=${subjectId}`;
        }
      }
      res.status(200).send({ questions, nextPage });
      return;
    })
    .catch(e => {
      res.status(500).send('Server error');
      console.error('Error: ', e);
      return;
    });
});

//Editing of a question
router.put('/questions', validate(updateValidation), function(req, res) {
  bcrypt.compare(req.body.password, HASH).then(function(pass) {
    if (pass) {
      Questions.findOne({
        where: { id: req.body.id },
        include: [Answers],
      }).then(question => {
        if (question) {
          try {
            validateAnswersUpdate(question.answers, req.body.answers);
          } catch (e) {
            console.log(e.message);
            res.status(422).send(e.message);
            return;
          }
          question
            .update(req.body)
            .then(updatedQuestion => {
              if (updatedQuestion) {
                updatedQuestion.answers.forEach(answer => {
                  answer.update(answer.dataValues).catch(e => {
                    res.status(500).send('Server error');
                    console.error('Error: ', e);
                    return;
                  });
                });
                res.status(200).send('Ok');
                return;
              } else {
                res.status(500).send('Server error');
                return;
              }
            })
            .catch(e => {
              res.status(500).send('Server error');
              console.error('Error: ', e);
              return;
            });
        } else {
          res.status(404).send('Not found');
          return;
        }
      });
    } else {
      res.status(401).send('Invalid password');
      return;
    }
  });
});

//Test begining
router.get('/start', validate(startValidation), function(req, res) {
  const { quantity, level, subjectId } = url.parse(req.url, true).query;
  const params = {
    where: {},
    include: [Answers],
    order: Sequelize.literal('rand()'),
  };
  if (level) params.where.level = level;
  if (subjectId) params.where.subjectId = subjectId;
  if (quantity) params.limit = parseInt(quantity);
  Questions.findAll(params)
    .then(questions => {
      const testId = Date.now();
      ongoingTests[testId] = { questions };
      //removing the correctness from the questions
      questions.forEach(q => {
        const { answers } = q.dataValues;
        answers.forEach(a => {
          return a.dataValues;
        });
        return q.dataValues;
      });
      const clonedQuestions = JSON.parse(JSON.stringify(questions));
      clonedQuestions.forEach(q => {
        q.answers.forEach(a => {
          delete a.isCorrect;
        });
      });
      res.status(200).send({ testId, questions: clonedQuestions });
      return;
    })
    .catch(e => {
      res.status(500).send('Server error');
      console.error('Error: ', e);
      return;
    });
});

//Test ending
router.post('/end', function(req, res) {
  res.send(ongoingTests);
});

module.exports = router;
