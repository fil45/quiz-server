const Joi = require('joi');
const { SUBJECTS_AMOUNT } = require('../constants');

module.exports = {
  body: {
    id: Joi.number().integer().required(),
    password: Joi.string().required(),
    question: Joi.string(),
    subjectId: Joi.number()
      .integer()
      .min(1)
      .max(SUBJECTS_AMOUNT),
    level: Joi.number()
      .integer()
      .min(1)
      .max(3),
    answers: Joi.array()
      .items({
        id: Joi.number().integer().required(),
        answer: Joi.string(),
        isCorrect: Joi.boolean(),
        questionId: Joi.any().forbidden(),
      })
  },
};
