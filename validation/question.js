const Joi = require('joi');
const { SUBJECTS_AMOUNT } = require('../constants');

module.exports = {
  body: {
    password: Joi.string().required(),
    question: Joi.string().required(),
    subjectId: Joi.number()
      .integer()
      .required()
      .min(1)
      .max(SUBJECTS_AMOUNT),
    level: Joi.number()
      .integer()
      .required()
      .min(1)
      .max(3),
    answers: Joi.array()
      .length(4)
      .required()
      .items({
        answer: Joi.string().required(),
        isCorrect: Joi.boolean().required(),
      })
      .unique((a, b) => a.answer === b.answer)  //validation that there are no identical answers
      .unique((a, b) => a.isCorrect && b.isCorrect), //validation that only one answer is correct
  },
};
